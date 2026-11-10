# =============================================================================
# OUTPUTS: DynamoDB
# =============================================================================
output "dynamodb_kms_key_arn" {
  description = "ARN de la clave KMS de DynamoDB"
  value       = module.dynamodb.kms_key_arn
}

output "dynamodb_policy_arn" {
  description = "ARN de la política IAM de DynamoDB"
  value       = module.dynamodb.dynamodb_policy_arn
}

output "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB"
  value       = module.dynamodb.dynamodb_table_name
}

output "dynamodb_table_arn" {
  description = "ARN de la tabla DynamoDB"
  value       = module.dynamodb.dynamodb_table_arn
}

# =============================================================================
# OUTPUTS: Recursos Adicionales
# =============================================================================
output "s3_api_logs_bucket" {
  description = "Nombre del bucket de logs de API Gateway"
  value       = aws_s3_bucket.api_logs.id
}

output "kms_key_arn" {
  description = "ARN de la clave KMS de la aplicación"
  value       = aws_kms_key.app_key.arn
}

output "kms_key_id" {
  description = "ID de la clave KMS de la aplicación"
  value       = aws_kms_key.app_key.key_id
}

output "kms_alias_name" {
  description = "Nombre del alias de la clave KMS"
  value       = aws_kms_alias.app_key_alias.name
}

output "iam_dynamodb_policy_arn" {
  description = "ARN de la política IAM de acceso completo a DynamoDB"
  value       = aws_iam_policy.dynamodb_full_access.arn
}

output "iam_kms_policy_arn" {
  description = "ARN de la política IAM de acceso a KMS"
  value       = aws_iam_policy.kms_access.arn
}

# =============================================================================
# OUTPUTS: Información de Cuenta y Región
# =============================================================================
output "aws_account_id" {
  description = "ID de la cuenta de AWS"
  value       = data.aws_caller_identity.current.account_id
}

output "aws_region" {
  description = "Región de AWS"
  value       = data.aws_region.current.name
}

output "aws_availability_zones" {
  description = "Zonas de disponibilidad disponibles"
  value       = data.aws_availability_zones.available.names
}

# =============================================================================
# OUTPUTS: Metadatos del Proyecto
# =============================================================================
output "project_name" {
  description = "Nombre del proyecto"
  value       = var.project_name
}

output "environment" {
  description = "Ambiente de despliegue"
  value       = var.environment
}

output "terraform_workspace" {
  description = "Workspace de Terraform utilizado"
  value       = terraform.workspace
}

output "deployment_timestamp" {
  description = "Timestamp de despliegue"
  value       = timestamp()
}