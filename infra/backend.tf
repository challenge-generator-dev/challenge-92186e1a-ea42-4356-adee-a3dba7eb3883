terraform {
  required_version = ">= 1.0"

  backend "s3" {
    bucket         = "${var.project_name}-terraform-state"
    key            = "${var.environment}/terraform.tfstate"
    region         = var.aws_region
    encrypt        = true
    dynamodb_table = "${var.project_name}-terraform-locks"
    acl            = "private"
    kms_key_id     = "alias/${var.project_name}-terraform"
  }
}

# Configuración del backend de Terraform con S3 y DynamoDB para estado remoto
#
# Este archivo configura el almacenamiento remoto del estado de Terraform en un
# bucket S3, lo que permite la colaboración entre múltiples desarrolladores y
# proporciona un historial de versiones del estado de la infraestructura.
#
# El locking mediante DynamoDB previene conflictos cuando múltiples usuarios
# ejecutan Terraform simultáneamente, garantizando consistencia en los cambios.
#
# Variables utilizadas:
#   - var.project_name: nombre del proyecto para naming de recursos
#   - var.environment: ambiente (dev, staging, prod) para separar estados
#   - var.aws_region: región de AWS donde se crea el bucket y la tabla
#
# Requisitos previos:
#   - Bucket S3 existente para almacenar el estado
#   - Tabla DynamoDB existente para locking (con partition key "LockID")
#   - Clave KMS para cifrado del estado en reposo
#
# Para ambientes de desarrollo locales que no tienen estos recursos creados,
# se puede comentar el bloque "backend" y usar el backend local por defecto.

# Recursos de infraestructura del backend (solo si no existen previamente)
# Estos recursos se crean fuera del backend para evitar dependencia circular

resource "aws_s3_bucket" "terraform_state" {
  bucket = "${var.project_name}-terraform-state"

  tags = {
    Name        = "${var.project_name}-terraform-state"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
    Purpose     = "remote-state-storage"
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.terraform_state.arn
    }
  }
}

resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_kms_key" "terraform_state" {
  description             = "Clave KMS para cifrado del estado de Terraform"
  deletion_window_in_days = 10
  enable_key_rotation     = true

  tags = {
    Name        = "${var.project_name}-terraform-kms"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
    Purpose     = "state-encryption"
  }
}

resource "aws_kms_alias" "terraform_state" {
  name          = "alias/${var.project_name}-terraform"
  target_key_id = aws_kms_key.terraform_state.key_id
}

resource "aws_dynamodb_table" "terraform_locks" {
  name         = "${var.project_name}-terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name        = "${var.project_name}-terraform-locks"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
    Purpose     = "state-locking"
  }

  lifecycle {
    prevent_destroy = true
  }
}

# Política IAM para acceso al bucket y tabla del backend
resource "aws_iam_policy" "terraform_backend_access" {
  name        = "${var.project_name}-terraform-backend-access"
  description = "Política para acceso al bucket S3 y tabla DynamoDB del backend de Terraform"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowS3Access"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.terraform_state.arn,
          "${aws_s3_bucket.terraform_state.arn}/*"
        ]
      },
      {
        Sid    = "AllowDynamoDBLocking"
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem",
          "dynamodb:DescribeTable"
        ]
        Resource = aws_dynamodb_table.terraform_locks.arn
      },
      {
        Sid    = "AllowKMSAccess"
        Effect = "Allow"
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:DescribeKey",
          "kms:GenerateDataKey"
        ]
        Resource = aws_kms_key.terraform_state.arn
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-terraform-backend-access"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
  }
}

# Outputs para referencia en otros módulos
output "terraform_state_bucket" {
  description = "Nombre del bucket S3 para estado de Terraform"
  value       = aws_s3_bucket.terraform_state.id
}

output "terraform_locks_table" {
  description = "Nombre de la tabla DynamoDB para locking de Terraform"
  value       = aws_dynamodb_table.terraform_locks.name
}

output "terraform_kms_key_arn" {
  description = "ARN de la clave KMS para cifrado del estado"
  value       = aws_kms_key.terraform_state.arn
}

output "terraform_backend_policy_arn" {
  description = "ARN de la política IAM para acceso al backend"
  value       = aws_iam_policy.terraform_backend_access.arn
}