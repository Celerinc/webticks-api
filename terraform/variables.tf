variable "location" {
  description = "Azure region"
  type        = string
  default     = "West Europe"
}

variable "acr_name" {
  description = "Azure Container Registry name (globally unique, alphanumeric only)"
  type        = string
  default     = "webticksprd"
}

variable "app_service_name" {
  description = "Linux Web App name (globally unique, becomes <name>.azurewebsites.net)"
  type        = string
  default     = "webticks-api-prd"
}

variable "sku_name" {
  description = "App Service Plan SKU"
  type        = string
  default     = "B2"
}

variable "cosmos_account_name" {
  description = "Cosmos DB account name (globally unique)"
  type        = string
  default     = "webticks-prd-cosmos"
}

variable "cosmos_database_name" {
  description = "Cosmos DB MongoDB database name"
  type        = string
  default     = "webticks"
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}
