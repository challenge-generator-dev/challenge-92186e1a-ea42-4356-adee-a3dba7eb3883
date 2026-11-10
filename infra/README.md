# Módulo de Infraestructura - Orders Management

Este módulo define la infraestructura como código para el sistema de gestión de órdenes, desplegando los recursos necesarios en AWS utilizando Terraform.

## Recursos Definidos

### DynamoDB
Tabla de órdenes con las siguientes características:
- Clave de partición: `order_id`
- Clave de ordenación: `created_at`
- TTL activo en atributo `expires_at`
- Modo de facturación bajo demanda (PAY_PER_REQUEST)
- Índices secundarios globales para consultas por status y cliente

### API Gateway
API RESTful para exposición de endpoints de órdenes:
- Nombre configurable por ambiente
- Stage de despliegue (dev, staging, prod)
- Integración con Lambda como backend
- Configuración de CORS para consumo desde frontend

### Lambda
Función serverless para procesamiento de operaciones CRUD:
- Runtime Node.js 20.x
- Configuración de memoria y timeout ajustables
- Permisos IAM para acceso a DynamoDB

## Estructura del Módulo

```
infra/
├── environments/
│   └── dev/
│       └── terraform.tfvars    # Valores específicos de dev
├── modules/
│   ├── dynamodb/               # Módulo de tabla DynamoDB
│   ├── api-gateway/            # Módulo de API Gateway
│   └── lambda/                 # Módulo de función Lambda
├── providers.tf                # Configuración de proveedores
├── variables.tf                # Variables del módulo principal
├── main.tf                     # Recursos principales
├── outputs.tf                  # Outputs del módulo
├── versions.tf                 # Versiones de Terraform y proveedores
├── backend.tf                  # Configuración de backend remoto
└── terraform.tfvars            # Valores por defecto (no versionar)
```

## Validación Local

### Prerrequisitos
- Terraform >= 1.0 instalado
- AWS CLI configurado con credenciales
- Acceso a la cuenta de AWS

### Comandos de Validación

1. **Inicializar Terraform:**
   ```bash
   terraform init
   ```

2. **Validar sintaxis:**
   ```bash
   terraform validate
   ```

3. **Planificar cambios:**
   ```bash
   terraform plan -var-file=environments/dev/terraform.tfvars
   ```

4. **Aplicar cambios:**
   ```bash
   terraform apply -var-file=environments/dev/terraform.tfvars
   ```

5. **Destruir recursos (para limpieza):**
   ```bash
   terraform destroy -var-file=environments/dev/terraform.tfvars
   ```

## Notas Importantes

- **No versionar**: El archivo `terraform.tfvars` contiene valores sensibles y debe estar en `.gitignore`
- **Workspaces**: Alternativamente, usar Terraform workspaces para manejar múltiples ambientes
- **Costos**: Los recursos desplegados generan costos en AWS; revisar la configuración de billing mode
- **Seguridad**: Las políticas IAM siguen el principio de mínimo privilegio necesario

## Outputs Disponibles

El módulo expone los siguientes outputs para consumo por otros módulos:
- Endpoint de API Gateway
- ARN de la tabla DynamoDB
- ARN de la función Lambda
- Nombre de los recursos para referencia