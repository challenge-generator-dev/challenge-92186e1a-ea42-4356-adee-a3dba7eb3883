# Configuración de providers para Terraform
# Este archivo declara los proveedores necesarios para desplegar la infraestructura
# y especifica las versiones exactas para garantizar consistencia.

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.40.0"
    }
  }
}

# Provider principal para AWS
# Configura la región por defecto y permite la personalización mediante variables.
provider "aws" {
  region = var.aws_region

  # Tags por defecto para todos los recursos
  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}

# Provider para us-east-1 (requerido para algunos servicios globales como Route53)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}

# Variables globales esperadas por este archivo