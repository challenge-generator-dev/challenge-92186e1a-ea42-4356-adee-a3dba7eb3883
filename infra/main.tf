# =============================================================================
# MÓDULO: DynamoDB Table
# =============================================================================
module "dynamodb" {
  source = "./modules/dynamodb"

  table_name               = var.dynamodb_table_name
  billing_mode             = var.dynamodb_billing_mode
  read_capacity            = var.dynamodb_read_capacity
  write_capacity           = var.dynamodb_write_capacity
  hash_key                 = var.dynamodb_hash_key
  range_key                = var.dynamodb_range_key
  ttl_attribute            = var.dynamodb_ttl_attribute
  global_secondary_indexes = var.dynamodb_global_secondary_indexes

  attributes = [
    {
      name = var.dynamodb_hash_key
      type = "S"
    },
    {
      name = var.dynamodb_range_key
      type = "S"
    },
    {
      name = "customer_id"
      type = "S"
    },
    {
      name = "status"
      type = "S"
    }
  ]

  environment  = var.environment
  project_name = var.project_name

  tags = {
    Component = "database"
    Purpose   = "orders-persistence"
  }
}

# =============================================================================
# MÓDULO: Lambda Function
# El módulo lambda se comentariza temporalmente hasta que esté disponible
# en el proyecto. Descomentar cuando se implemente el módulo.
# =============================================================================
# module "lambda" {
#   source = "./modules/lambda"
# 
#   function_name = var.lambda_function_name
#   runtime       = var.lambda_runtime
#   handler       = var.lambda_handler
#   memory_size   = var.lambda_memory_size
#   timeout       = var.lambda_timeout
#   environment   = var.environment
#   project_name  = var.project_name
# 
#   dynamodb_table_arn  = module.dynamodb.dynamodb_table_arn
#   dynamodb_table_name = var.dynamodb_table_name
# 
#   tags = {
#     Component = "compute"
#     Purpose   = "orders-api-handler"
#   }
# }

# =============================================================================
# MÓDULO: API Gateway
# =============================================================================
module "api_gateway" {
  source = "./modules/api-gateway"

  name         = var.api_gateway_name
  stage_name   = var.api_gateway_stage_name
  environment  = var.environment
  project_name = var.project_name

  # lambda_function_arn  = module.lambda.lambda_function_arn
  # lambda_function_name = var.lambda_function_name
  # Temporal: usar ARN vacío hasta que lambda esté disponible
  lambda_function_arn  = ""
  lambda_function_name = var.lambda_function_name

  api_log_bucket_arn = aws_s3_bucket.api_logs.arn

  tags = {
    Component = "api"
    Purpose   = "orders-rest-api"
  }
}

# =============================================================================
# RECURSOS ADICIONALES DE INFRAESTRUCTURA
# =============================================================================

# Bucket de S3 para logs de acceso a API Gateway
resource "aws_s3_bucket" "api_logs" {
  bucket = "${var.project_name}-api-logs-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = {
    Name        = "API Gateway Logs"
    Environment = var.environment
    Component   = "logging"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "api_logs" {
  bucket = aws_s3_bucket.api_logs.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_versioning" "api_logs" {
  bucket = aws_s3_bucket.api_logs.id
  versioning_configuration {
    status = "Enabled"
  }
}

# AWS KMS Key para cifrado de datos en reposo
resource "aws_kms_key" "app_key" {
  description             = "KMS Key for ${var.project_name} ${var.environment}"
  deletion_window_in_days = 10
  enable_key_rotation     = true

  tags = {
    Name        = "${var.project_name}-kms-key"
    Environment = var.environment
    Component   = "security"
  }
}

resource "aws_kms_alias" "app_key_alias" {
  name          = "alias/${var.project_name}-${var.environment}"
  target_key_id = aws_kms_key.app_key.key_id
}

# Obtener información de la cuenta actual
data "aws_caller_identity" "current" {}

# Obtener información de la región de AWS
data "aws_region" "current" {}

# Obtener AZs disponibles para la región
data "aws_availability_zones" "available" {
  state = "available"
}

# =============================================================================
# POLÍTICAS DE ACCESO Y PERMISOS
# =============================================================================

# Política de acceso completo a DynamoDB para el entorno de desarrollo
resource "aws_iam_policy" "dynamodb_full_access" {
  name        = "${var.project_name}-dynamodb-full-access-${var.environment}"
  description = "Full access to DynamoDB tables for ${var.project_name}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:*"
        ]
        Resource = [
          module.dynamodb.dynamodb_table_arn,
          "${module.dynamodb.dynamodb_table_arn}/*"
        ]
      }
    ]
  })

  tags = {
    Component = "security"
    Purpose   = "iam-policy"
  }
}

# Política de acceso a KMS
resource "aws_iam_policy" "kms_access" {
  name        = "${var.project_name}-kms-access-${var.environment}"
  description = "Access to KMS key for ${var.project_name}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:DescribeKey",
          "kms:GenerateDataKey*"
        ]
        Resource = aws_kms_key.app_key.arn
      }
    ]
  })

  tags = {
    Component = "security"
    Purpose   = "iam-policy"
  }
}