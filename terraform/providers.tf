terraform {
  required_version = ">= 1.5"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }

  # Switch to remote state once the storage account exists:
  # backend "azurerm" {
  #   resource_group_name  = "webticks-prd-rg"
  #   storage_account_name = "<your-storage-account>"
  #   container_name       = "tfstate"
  #   key                  = "webticks-api.tfstate"
  # }
}

provider "azurerm" {
  features {}
}
