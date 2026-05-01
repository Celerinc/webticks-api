locals {
  # Inject database name into the Cosmos DB connection string before the query string
  database_url = replace(
    azurerm_cosmosdb_account.main.primary_mongodb_connection_string,
    "/?ssl=",
    "/${var.cosmos_database_name}?ssl="
  )
}

resource "azurerm_resource_group" "main" {
  name     = "webticks-prd-rg"
  location = var.location
}

resource "azurerm_container_registry" "main" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true
}

# ── Cosmos DB ─────────────────────────────────────────────────────────────────

resource "azurerm_cosmosdb_account" "main" {
  name                = var.cosmos_account_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  offer_type          = "Standard"
  kind                = "MongoDB"
  mongo_server_version = "4.2"

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = azurerm_resource_group.main.location
    failover_priority = 0
  }

  capabilities {
    name = "EnableMongo"
  }

  capabilities {
    name = "mongoEnableDocLevelTTL"
  }

  public_network_access_enabled = true

  # ip_range_filter is set out-of-band by terraform_data.cosmos_ip_filter below
  # to avoid a circular dependency: web app needs cosmos conn string,
  # cosmos IP filter needs web app outbound IPs.
  ip_range_filter = []

  lifecycle {
    ignore_changes = [ip_range_filter]
  }
}

resource "azurerm_cosmosdb_mongo_database" "main" {
  name                = var.cosmos_database_name
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
}

# ── App Service ───────────────────────────────────────────────────────────────

resource "azurerm_service_plan" "main" {
  name                = "webticks-prd-plan"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = var.sku_name
}

resource "azurerm_linux_web_app" "main" {
  name                = var.app_service_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  service_plan_id     = azurerm_service_plan.main.id
  https_only          = true

  site_config {
    always_on = true

    application_stack {
      docker_image     = "${azurerm_container_registry.main.login_server}/webticks-api"
      docker_image_tag = "latest"
    }
  }

  app_settings = {
    DOCKER_REGISTRY_SERVER_URL      = "https://${azurerm_container_registry.main.login_server}"
    DOCKER_REGISTRY_SERVER_USERNAME = azurerm_container_registry.main.admin_username
    DOCKER_REGISTRY_SERVER_PASSWORD = azurerm_container_registry.main.admin_password
    WEBSITES_PORT                   = "3000"
    NODE_ENV                        = "production"
    DATABASE_URL                    = local.database_url
    JWT_SECRET                      = var.jwt_secret
  }

  logs {
    http_logs {
      retention_in_days = 7
    }
  }
}

# ── Cosmos DB IP restriction ───────────────────────────────────────────────────
#
# Restricts Cosmos DB to only accept connections from the web app's outbound IPs.
# Runs after both resources exist; re-runs if outbound IPs ever change.
# Requires `az` CLI available on the machine running terraform apply.

resource "terraform_data" "cosmos_ip_filter" {
  depends_on = [azurerm_linux_web_app.main, azurerm_cosmosdb_account.main]

  triggers_replace = [azurerm_linux_web_app.main.outbound_ip_addresses]

  provisioner "local-exec" {
    command = <<-EOT
      az cosmosdb update \
        --name ${azurerm_cosmosdb_account.main.name} \
        --resource-group ${azurerm_resource_group.main.name} \
        --ip-range-filter "${azurerm_linux_web_app.main.outbound_ip_addresses}"
    EOT
  }
}
