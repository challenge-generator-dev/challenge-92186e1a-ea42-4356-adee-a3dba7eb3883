# =============================================================================
# MÓDULO: API Gateway
# =============================================================================
# Este módulo crea un API Gateway REST con integración a Lambda.
# Configura el stage de despliegue y los permisos necesarios.

# =============================================================================
# RECURSO: API Gateway REST API
# =============================================================================
resource "aws_api_gateway_rest_api" "this" {
  name        = var.name
  description = "API Gateway for ${var.project_name} - ${var.environment}"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = merge(var.tags, {
    Name        = var.name
    Environment = var.environment
    Component   = "api-gateway"
  })
}

# =============================================================================
# RECURSO: Recurso raíz del API
# =============================================================================
resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "{proxy+}"
}

# =============================================================================
# RECURSO: Método ANY para el proxy
# =============================================================================
resource "aws_api_gateway_method" "proxy_any" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

# =============================================================================
# RECURSO: Integración con Lambda
# =============================================================================
resource "aws_api_gateway_integration" "lambda" {
  count = var.lambda_function_arn != "" ? 1 : 0

  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_method.proxy_any.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_function_arn

  request_parameters = {
    "integration.request.path.proxy" = "method.request.path.proxy"
  }
}

# =============================================================================
# RECURSO: Método raíz ANY
# =============================================================================
resource "aws_api_gateway_method" "root_any" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_rest_api.this.root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

# =============================================================================
# RECURSO: Integración Lambda para raíz
# =============================================================================
resource "aws_api_gateway_integration" "root_lambda" {
  count = var.lambda_function_arn != "" ? 1 : 0

  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_rest_api.this.root_resource_id
  http_method = aws_api_gateway_method.root_any.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_function_arn
}

# =============================================================================
# RECURSO: Deployment del API Gateway
# =============================================================================
resource "aws_api_gateway_deployment" "this" {
  rest_api_id = aws_api_gateway_rest_api.this.id

  depends_on = [
    aws_api_gateway_integration.lambda,
    aws_api_gateway_integration.root_lambda
  ]

  lifecycle {
    create_before_destroy = true
  }
}

# =============================================================================
# RECURSO: Stage de despliegue
# =============================================================================
resource "aws_api_gateway_stage" "this" {
  deployment_id = aws_api_gateway_deployment.this.id
  rest_api_id   = aws_api_gateway_rest_api.this.id
  stage_name    = var.stage_name

  access_log_settings {
    destination_arn = var.api_log_bucket_arn
    format          = "$context.requestId: $context.endpoint $context.httpMethod $context.status $context.responseLatency $context.requestTime"
  }

  tags = merge(var.tags, {
    Name        = "${var.name}-${var.stage_name}"
    Environment = var.environment
    Component   = "api-stage"
  })
}

# =============================================================================
# RECURSO: Permiso para invocar Lambda
# =============================================================================
resource "aws_lambda_permission" "api_gateway" {
  count = var.lambda_function_arn != "" ? 1 : 0

  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.this.execution_arn}/*/*"
}

# =============================================================================
# VARIABLES DEL MÓDULO
# =============================================================================
variable "name" {
  description = "Nombre del API Gateway"
  type        = string
}

variable "stage_name" {
  description = "Nombre del stage de despliegue"
  type        = string
}

variable "environment" {
  description = "Entorno de despliegue"
  type        = string
}

variable "project_name" {
  description = "Nombre del proyecto"
  type        = string
}

variable "lambda_function_arn" {
  description = "ARN de la función Lambda a invocar"
  type        = string
  default     = ""
}

variable "lambda_function_name" {
  description = "Nombre de la función Lambda"
  type        = string
}

variable "api_log_bucket_arn" {
  description = "ARN del bucket de S3 para logs de API Gateway"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags adicionales para los recursos"
  type        = map(string)
  default     = {}
}