output "web_app_url" {
  value = "https://${azurerm_linux_web_app.main.default_hostname}"
}

output "acr_login_server" {
  value = azurerm_container_registry.main.login_server
}

output "acr_admin_username" {
  value     = azurerm_container_registry.main.admin_username
  sensitive = true
}

output "cosmos_endpoint" {
  value = azurerm_cosmosdb_account.main.endpoint
}

output "cosmos_database_name" {
  value = azurerm_cosmosdb_mongo_database.main.name
}

output "web_app_outbound_ips" {
  description = "IPs whitelisted on Cosmos DB"
  value       = azurerm_linux_web_app.main.outbound_ip_addresses
}
