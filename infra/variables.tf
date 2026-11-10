# Variables globales para la configuración de la infraestructura
# Estas variables son utilizadas por múltiples módulos y recursos.

# Variables de entorno y proyecto
variable "environment" {
  description = "Ambiente de despliegue (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Nombre del proyecto para etiquetar recursos"
  type        = string
  default     = "orders-management-20261110090352996"
}

variable "aws_region" {
  description = "Región de AWS donde se desplegará la infraestructura"
  type        = string
  default     = "us-east-1"
}

# Variables para DynamoDB
variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para ordenes"
  type        = string
  default     = "orders"
}

variable "dynamodb_billing_mode" {
  description = "Modo de facturación para DynamoDB (PROVISIONED o PAY_PER_REQUEST)"
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "dynamodb_read_capacity" {
  description = "Capacidad de lectura provisionada (solo aplicable si billing_mode es PROVISIONED)"
  type        = number
  default     = 5
}

variable "dynamodb_write_capacity" {
  description = "Capacidad de escritura provisionada (solo aplicable si billing_mode es PROVISIONED)"
  type        = number
  default     = 5
}

variable "dynamodb_hash_key" {
  description = "Nombre del atributo clave hash para la tabla DynamoDB"
  type        = string
  default     = "order_id"
}

variable "dynamodb_range_key" {
  description = "Nombre del atributo clave range para la tabla DynamoDB (opcional)"
  type        = string
  default     = "created_at"
}

variable "dynamodb_ttl_attribute" {
  description = "Nombre del atributo para Time To Live (TTL) en DynamoDB (opcional)"
  type        = string
  default     = "expires_at"
}

variable "dynamodb_global_secondary_indexes" {
  description = "Lista de índices secundarios globales para la tabla DynamoDB"
  type = list(object({
    name               = string
    hash_key           = string
    range_key          = optional(string)
    projection_type    = string
    read_capacity      = optional(number)
    write_capacity     = optional(number)
    non_key_attributes = optional(list(string), [])
  }))
  default = [
    {
      name               = "customer_id-index"
      hash_key           = "customer_id"
      projection_type    = "INCLUDE"
      non_key_attributes = ["order_status", "total_amount"]
    }
  ]
}

# Variables para API Gateway
variable "api_gateway_name" {
  description = "Nombre del API Gateway"
  type        = string
  default     = "orders-api"
}

variable "api_gateway_stage_name" {
  description = "Nombre del stage para el API Gateway"
  type        = string
  default     = "dev"
}

# Variables para Lambda
variable "lambda_function_name" {
  description = "Nombre de la función Lambda para manejar operaciones CRUD"
  type        = string
  default     = "orders-crud-handler"
}

variable "lambda_runtime" {
  description = "Runtime para la función Lambda"
  type        = string
  default     = "nodejs20.x"
}

variable "lambda_handler" {
  description = "Handler para la función Lambda"
  type        = string
  default     = "index.handler"
}

variable "lambda_memory_size" {
  description = "Memoria asignada a la función Lambda (en MB)"
  type        = number
  default     = 128
}

variable "lambda_timeout" {
  description = "Tiempo máximo de ejecución para la función Lambda (en segundos)"
  type        = number
  default     = 3
}