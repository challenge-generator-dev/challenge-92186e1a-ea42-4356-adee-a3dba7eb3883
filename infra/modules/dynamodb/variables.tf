# Variables para el módulo DynamoDB
# Estas variables permiten personalizar la configuración de la tabla DynamoDB.

variable "table_name" {
  description = "Nombre de la tabla DynamoDB"
  type        = string
}

variable "billing_mode" {
  description = "Modo de facturación para DynamoDB (PROVISIONED o PAY_PER_REQUEST)"
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "read_capacity" {
  description = "Capacidad de lectura provisionada (solo aplicable si billing_mode es PROVISIONED)"
  type        = number
  default     = 5
}

variable "write_capacity" {
  description = "Capacidad de escritura provisionada (solo aplicable si billing_mode es PROVISIONED)"
  type        = number
  default     = 5
}

variable "hash_key" {
  description = "Nombre del atributo clave hash para la tabla"
  type        = string
}

variable "range_key" {
  description = "Nombre del atributo clave range para la tabla (opcional)"
  type        = string
  default     = null
}

variable "attributes" {
  description = "Lista de atributos para la tabla DynamoDB"
  type = list(object({
    name = string
    type = string
  }))
  default = []
}

variable "ttl_attribute" {
  description = "Nombre del atributo para Time To Live (TTL) en DynamoDB (opcional)"
  type        = string
  default     = null
}

variable "global_secondary_indexes" {
  description = "Lista de índices secundarios globales para la tabla"
  type = list(object({
    name               = string
    hash_key           = string
    range_key          = optional(string)
    projection_type    = string
    read_capacity      = optional(number)
    write_capacity     = optional(number)
    non_key_attributes = optional(list(string))
  }))
  default = []
}

variable "environment" {
  description = "Ambiente de despliegue (dev, staging, prod)"
  type        = string
}

variable "project_name" {
  description = "Nombre del proyecto para etiquetar recursos"
  type        = string
}

variable "tags" {
  description = "Tags adicionales para la tabla DynamoDB"
  type        = map(string)
  default     = {}
}