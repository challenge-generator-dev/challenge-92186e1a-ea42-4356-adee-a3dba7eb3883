# =============================================================================
# OUTPUTS - Módulo de DynamoDB
# =============================================================================
# Estos outputs exponen la información de los recursos creados para que
# otros módulos puedan consumirlos de forma controlada.

output "dynamodb_table_name" {
  description = "Nombre de la tabla de DynamoDB"
  value       = aws_dynamodb_table.this.name
}

output "dynamodb_table_arn" {
  description = "ARN completo de la tabla de DynamoDB"
  value       = aws_dynamodb_table.this.arn
}

output "dynamodb_table_id" {
  description = "ID de la tabla de DynamoDB"
  value       = aws_dynamodb_table.this.id
}

output "dynamodb_endpoint" {
  description = "Endpoint de la tabla de DynamoDB"
  value       = aws_dynamodb_table.this.dynamodb_endpoint
}

output "dynamodb_kms_key_arn" {
  description = "ARN de la clave KMS utilizada para cifrado"
  value       = aws_kms_key.dynamodb_key.arn
}

output "dynamodb_policy_arn" {
  description = "ARN de la política IAM de acceso a DynamoDB"
  value       = aws_iam_policy.dynamodb_policy.arn
}

output "dynamodb_kms_key_id" {
  description = "ID de la clave KMS"
  value       = aws_kms_key.dynamodb_key.key_id
}