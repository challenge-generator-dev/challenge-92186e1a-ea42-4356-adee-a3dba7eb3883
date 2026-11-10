resource "aws_dynamodb_table" "this" {
  name           = var.table_name
  billing_mode   = var.billing_mode
  hash_key       = var.hash_key
  range_key      = var.range_key
  read_capacity  = var.billing_mode == "PROVISIONED" ? var.read_capacity : null
  write_capacity = var.billing_mode == "PROVISIONED" ? var.write_capacity : null

  dynamic "attribute" {
    for_each = var.attributes
    content {
      name = attribute.value.name
      type = attribute.value.type
    }
  }

  dynamic "global_secondary_index" {
    for_each = var.global_secondary_indexes
    content {
      hash_key        = global_secondary_index.value.hash_key
      range_key       = try(global_secondary_index.value.range_key, null)
      projection_type = try(global_secondary_index.value.projection_type, "KEYS_ONLY")
      read_capacity   = var.billing_mode == "PROVISIONED" ? try(global_secondary_index.value.read_capacity, var.read_capacity) : null
      write_capacity  = var.billing_mode == "PROVISIONED" ? try(global_secondary_index.value.write_capacity, var.write_capacity) : null

      non_key_attributes = try(global_secondary_index.value.non_key_attributes, [])
    }
  }

  dynamic "local_secondary_index" {
    for_each = var.range_key != null ? [1] : []
    content {
      name            = "${var.table_name}_lsi"
      range_key       = var.range_key
      projection_type = "ALL"
    }
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.dynamodb_key.arn
  }

  point_in_time_recovery {
    enabled = true
  }

  ttl {
    attribute_name = var.ttl_attribute
    enabled        = var.ttl_attribute != null
  }

  tags = merge(
    var.tags,
    {
      Name        = var.table_name
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "terraform"
    }
  )

  lifecycle {
    prevent_destroy = false
    ignore_changes = [
      tags
    ]
  }
}

resource "aws_kms_key" "dynamodb_key" {
  description             = "KMS key for DynamoDB table ${var.table_name} encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = merge(
    var.tags,
    {
      Name        = "${var.table_name}-kms-key"
      Environment = var.environment
      Project     = var.project_name
    }
  )
}

resource "aws_kms_alias" "dynamodb_key_alias" {
  name          = "alias/${var.table_name}-key"
  target_key_id = aws_kms_key.dynamodb_key.key_id
}

resource "aws_iam_policy" "dynamodb_policy" {
  name        = "${var.table_name}-dynamodb-policy"
  description = "IAM policy for accessing DynamoDB table ${var.table_name}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.this.arn,
          "${aws_dynamodb_table.this.arn}/index/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:DescribeTable",
          "dynamodb:GetItem",
          "dynamodb:Scan"
        ]
        Resource = aws_dynamodb_table.this.arn
      }
    ]
  })

  tags = merge(
    var.tags,
    {
      Name        = "${var.table_name}-iam-policy"
      Environment = var.environment
      Project     = var.project_name
    }
  )
}

output "kms_key_arn" {
  value       = aws_kms_key.dynamodb_key.arn
  description = "ARN de la clave KMS utilizada para cifrado de la tabla"
}