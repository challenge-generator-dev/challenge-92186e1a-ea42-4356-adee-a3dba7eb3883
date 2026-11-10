# Valores por defecto de Terraform
# Este archivo contiene la configuración base que se aplica cuando
# no se especifica un archivo de variables específico por ambiente.
# NOTA: Este archivo NO debe ser versionado en control de cambios.
# Agregar a .gitignore: terraform.tfvars

# ===========================================
# CONFIGURACIÓN BASE DEL PROYECTO
# ===========================================

# Nombre del proyecto (identificador único)
project_name = "orders-management-20261110090352996"

# Región de AWS donde se desplegarán los recursos
aws_region = "us-east-1"

# Ambiente de despliegue
environment = "dev"

# ===========================================
# CONFIGURACIÓN DE DYNAMODB
# ===========================================

# Nombre de la tabla de órdenes
dynamodb_table_name = "orders"

# Modo de facturación:
# PAY_PER_REQUEST: bajo demanda, sin costo fijo
# PROVISIONED: capacidad dedicada, menor costo para alto tráfico
dynamodb_billing_mode = "PAY_PER_REQUEST"

# Capacidad de lectura (solo para modo PROVISIONED)
dynamodb_read_capacity = 5

# Capacidad de escritura (solo para modo PROVISIONED)
dynamodb_write_capacity = 5

# Nombre del atributo de clave de partición
dynamodb_hash_key = "order_id"

# Nombre del atributo de clave de ordenación
dynamodb_range_key = "created_at"

# Nombre del atributo TTL para eliminación automática
dynamodb_ttl_attribute = "expires_at"

# ===========================================
# CONFIGURACIÓN DE API GATEWAY
# ===========================================

# Nombre de la API REST
api_gateway_name = "orders-api"

# Nombre del stage de despliegue
api_gateway_stage_name = "dev"

# ===========================================
# CONFIGURACIÓN DE LAMBDA
# ===========================================

# Nombre de la función Lambda
lambda_function_name = "orders-crud-handler"

# Runtime de Lambda (versiones soportadas: nodejs18.x, nodejs20.x)
lambda_runtime = "nodejs20.x"

# Handler de la función (ruta relativa al archivo index)
lambda_handler = "index.handler"

# Memoria en MB (entre 128 y 10240)
lambda_memory_size = 128

# Timeout en segundos (entre 1 y 900)
lambda_timeout = 3

# ===========================================
# TAGS COMUNES
# ===========================================

# Tags que se aplican a todos los recursos desplegados
# Facilitan la identificación, agrupación y costeo
common_tags = {
  Project     = "orders-management-20261110090352996"
  ManagedBy   = "terraform"
  Environment = "dev"
  CostCenter  = "engineering"
  Repository  = "https://github.com/org/orders-management"
}