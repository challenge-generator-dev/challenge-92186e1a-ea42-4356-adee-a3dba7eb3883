# Valores específicos para el ambiente de desarrollo
# Este archivo contiene la configuración particular del entorno dev
# y se carga automáticamente cuando terraform plan/apply se ejecuta
# desde el directorio environments/dev o cuando se especifica este archivo

# Configuración del ambiente
environment  = "dev"
project_name = "orders-management-20261110090352996"
aws_region   = "us-east-1"

# Configuración de DynamoDB para desarrollo
# En dev usamos capacidad bajo demanda para evitar costos fijos
dynamodb_table_name     = "orders-dev"
dynamodb_billing_mode   = "PAY_PER_REQUEST"
dynamodb_read_capacity  = 5
dynamodb_write_capacity = 5
dynamodb_hash_key       = "order_id"
dynamodb_range_key      = "created_at"
dynamodb_ttl_attribute  = "expires_at"

# Configuración de API Gateway para desarrollo
api_gateway_name       = "orders-api-dev"
api_gateway_stage_name = "dev"

# Configuración de Lambda para desarrollo
# Memoria y timeout moderados para desarrollo
lambda_function_name = "orders-crud-handler-dev"
lambda_runtime       = "nodejs20.x"
lambda_handler       = "index.handler"
lambda_memory_size   = 256
lambda_timeout       = 10

# Tags comunes para todos los recursos
# Facilitan la identificación y el costeo por ambiente
common_tags = {
  Environment = "dev"
  Project     = "orders-management-20261110090352996"
  ManagedBy   = "terraform"
  CostCenter  = "engineering"
}