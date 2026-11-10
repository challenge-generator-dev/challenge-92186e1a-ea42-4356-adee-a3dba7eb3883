# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener el proyecto completo y arrancable. Guarda los archivos que te devuelva en la
carpeta del repo, respetando exactamente las rutas.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | DynamoDB |
| `client` | `client/` | chapter, support | client | React | React |
| `infra` | `infra/` | support | infra | Terraform (AWS) | Terraform |
| `infra-local` | (raiz) | support | infra | Compose local | DynamoDB |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate` — componente `infra` (support).
3. `cd api && npm install && npm run build` — componente `api` (practice).
4. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `POST /orders`
  - `GET /orders/{id}`
  - `PUT /orders/{id}`
  - `DELETE /orders/{id}`
  - `GET /orders`
- `client` expone http (api: http://localhost:3000):
  - `POST /orders`
  - `GET /orders/{id}`
  - `PUT /orders/{id}`
  - `DELETE /orders/{id}`
  - `GET /orders`

## Herramientas

- **Terraform**: Herramienta de trabajo del candidato: usala en la fase donde se depura o se prueba la solucion (no es una dependencia del proyecto).

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `api/src/domain/order.entity.ts` — `OrderItem.reduce`: Se invoca `reduce` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/domain/order.entity.ts` — `OrderItem.some`: Se invoca `some` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

## Como saber que terminaste

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Perfil
Chapter Frontend, Especialidad Desarrollador, Tecnología React, Advanced L2

### Brecha de conocimiento
CRUD de ordenes en DynamoDB desde la interfaz (corrida e2e 20261110090352996), Implementa operaciones CRUD de ordenes en DynamoDB desde la interfaz y versiona la infraestructura

### Misión / candidato
Gestionar ordenes

### Reto
- Tema: Persistir ordenes en DynamoDB desde la interfaz
- Seniority: advanced-l2
- Tipo: practical
- Título: Implementación de operaciones CRUD de ordenes en DynamoDB
- Tiempo estimado: 8 horas

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Configuración inicial y creación de ordenes — objetivo: Configurar el entorno de desarrollo y permitir la creación de nuevas ordenes en DynamoDB. — entregable (NO resolver): Entorno de desarrollo configurado y funcionalidad de creación de ordenes implementada.
- Fase 2: Lectura y actualización de ordenes — objetivo: Implementar la funcionalidad para leer y actualizar ordenes existentes en DynamoDB. — entregable (NO resolver): Funcionalidad de lectura y actualización de ordenes implementada.
- Fase 3: Eliminación de ordenes y versionado de infraestructura — objetivo: Implementar la funcionalidad para eliminar ordenes existentes en DynamoDB y versionar la infraestructura utilizando Terraform. — entregable (NO resolver): Funcionalidad de eliminación de ordenes implementada y cambios en la infraestructura versionados.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (entrega de archivos).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Entrega de archivos
Entregá cada archivo con su ruta completa, respetando exactamente la estructura de rutas
indicada por los marcadores: un bloque por archivo, precedido por su ruta. No generes ZIPs
ni archivos adjuntos.
La entrega debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: Entregá los archivos completos al finalizar. No preguntes si el usuario
quiere recibirlos. Simplemente entregalos; No debes desplegar en el chat el resumen de lo que arreglaste, solo entregá los archivos.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del último archivo entregado
No preguntes si el usuario quiere los archivos: simplemente entregalos siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: api/package.json ===
{
  "name": "orders-api",
  "version": "1.0.0",
  "description": "API para gestión de órdenes con persistencia en DynamoDB",
  "main": "dist/main.js",
  "scripts": {
    "build": "tsc",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "ts-node src/main.ts",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.470.0",
    "@aws-sdk/lib-dynamodb": "^3.470.0",
    "@nestjs/common": "^11.0.0",
    "@nestjs/config": "^4.0.4",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "@nestjs/swagger": "^11.4.8",
    "aws-sdk": "^2.1536.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@nestjs/testing": "^11.0.0",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.11",
    "@types/node": "^20.10.4",
    "@types/supertest": "^2.0.16",
    "@types/uuid": "^9.0.8",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "eslint": "^8.55.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.0.1",
    "jest": "^29.7.0",
    "prettier": "^3.1.1",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.1",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".test.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}

// === ARCHIVO: api/tsconfig.json ===
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2022",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test", "**/*.spec.ts"]
}

// === ARCHIVO: api/src/domain/order.entity.ts ===
import { v4 as uuidv4 } from 'uuid';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

type OrderStatusTransitionMap = {
  [K in OrderStatus]: OrderStatus[];
};

const validTransitions: OrderStatusTransitionMap = {
  [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
};

export class OrderEntity {
  id: string;
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  version: number;

  constructor(
    customerId: string,
    items: OrderItem[],
    status?: OrderStatus,
    id?: string,
    totalAmount?: number,
    createdAt?: Date,
    updatedAt?: Date,
    version?: number,
  ) {
    this.id = id || uuidv4();
    this.customerId = customerId;
    this.items = items;
    this.status = status || OrderStatus.PENDING;
    this.totalAmount = totalAmount || this.calculateTotalAmount();
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.version = version || 1;
    this.validate();
  }

  private calculateTotalAmount(): number {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }

  private validate(): void {
    if (!this.customerId || this.customerId.trim().length === 0) {
      throw new Error('El customerId no puede estar vacío');
    }
    if (!this.items || this.items.length === 0) {
      throw new Error('La orden debe tener al menos un item');
    }
    if (this.totalAmount < 0) {
      throw new Error('El totalAmount no puede ser negativo');
    }
    if (
      this.items.some((item) => item.quantity <= 0 || item.price <= 0)
    ) {
      throw new Error('Todos los items deben tener precio y cantidad positivos');
    }
  }

  updateStatus(newStatus: OrderStatus): void {
    const allowed = validTransitions[this.status];
    if (!allowed.includes(newStatus)) {
      throw new Error(
        `Transición de estado no permitida: ${this.status} -> ${newStatus}`,
      );
    }
    this.status = newStatus;
    this.updatedAt = new Date();
    this.version += 1;
  }

  updateItems(newItems: OrderItem[]): void {
    this.items = newItems;
    this.totalAmount = this.calculateTotalAmount();
    this.updatedAt = new Date();
    this.version += 1;
    this.validate();
  }
}

// === ARCHIVO: api/src/infrastructure/repositories/order.repository.ts ===
import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { OrderEntity, OrderStatus } from '../../domain/order.entity';
import { ConfigService } from '@nestjs/config';

/**
 * Repositorio que implementa las operaciones de persistencia para órdenes en DynamoDB.
 * Utiliza el patrón de puerto y adaptador para desacoplar el dominio de la infraestructura.
 */
@Injectable()
export class OrderRepository {
    private readonly client: DynamoDBDocumentClient;
    private readonly tableName: string;

    constructor(private readonly configService: ConfigService) {
        const dynamoDBClient = new DynamoDBClient({
            region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
            endpoint: this.configService.get<string>('DYNAMODB_ENDPOINT')
        });
        this.client = DynamoDBDocumentClient.from(dynamoDBClient);
        this.tableName = this.configService.get<string>('DYNAMODB_TABLE', 'Orders');
    }

    async create(order: OrderEntity): Promise<OrderEntity> {
        const command = new PutCommand({
            TableName: this.tableName,
            Item: {
                id: order.id,
                customerId: order.customerId,
                items: order.items,
                status: order.status,
                totalAmount: order.totalAmount,
                createdAt: order.createdAt.toISOString(),
                updatedAt: order.updatedAt.toISOString(),
                version: order.version,
                PK: `CUSTOMER#${order.customerId}`,
                SK: `ORDER#${order.id}`
            },
            ConditionExpression: 'attribute_not_exists(id)'
        });

        try {
            await this.client.send(command);
            return order;
        } catch (error) {
            if (error.name === 'ConditionalCheckFailedException') {
                throw new Error('La orden ya existe');
            }
            throw new Error(`Error al crear la orden: ${error.message}`);
        }
    }

    async findById(id: string): Promise<OrderEntity | null> {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: { id }
        });

        const result = await this.client.send(command);
        if (!result.Item) {
            return null;
        }

        return this.mapDynamoItemToOrderEntity(result.Item);
    }

    async update(order: OrderEntity): Promise<OrderEntity> {
        const command = new UpdateCommand({
            TableName: this.tableName,
            Key: { id: order.id },
            UpdateExpression: 
                'SET customerId = :customerId, items = :items, status = :status, '
                + 'totalAmount = :totalAmount, updatedAt = :updatedAt, version = :version',
            ExpressionAttributeValues: {
                ':customerId': order.customerId,
                ':items': order.items,
                ':status': order.status,
                ':totalAmount': order.totalAmount,
                ':updatedAt': order.updatedAt.toISOString(),
                ':version': order.version
            },
            ReturnValues: 'ALL_NEW'
        });

        try {
            const result = await this.client.send(command);
            return this.mapDynamoItemToOrderEntity(result.Attributes);
        } catch (error) {
            throw new Error(`Error al actualizar la orden: ${error.message}`);
        }
    }

    async delete(id: string): Promise<void> {
        const command = new DeleteCommand({
            TableName: this.tableName,
            Key: { id }
        });

        try {
            await this.client.send(command);
        } catch (error) {
            throw new Error(`Error al eliminar la orden: ${error.message}`);
        }
    }

    async findByCustomerId(customerId: string): Promise<OrderEntity[]> {
        const command = new QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: 'PK = :pk',
            ExpressionAttributeValues: {
                ':pk': `CUSTOMER#${customerId}`
            }
        });

        const result = await this.client.send(command);
        if (!result.Items || result.Items.length === 0) {
            return [];
        }

        return result.Items.map(item => this.mapDynamoItemToOrderEntity(item));
    }

    private mapDynamoItemToOrderEntity(item: any): OrderEntity {
        return new OrderEntity(
            item.customerId,
            item.items,
            item.status as OrderStatus,
            item.id,
            item.totalAmount,
            new Date(item.createdAt),
            new Date(item.updatedAt),
            item.version
        );
    }
}

// === ARCHIVO: api/src/common/dto/create-order.dto.ts ===
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsPositive, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para la creación de órdenes.
 * Contiene validaciones para asegurar la integridad de los datos.
 */
export class CreateOrderItemDto {
    @ApiProperty({ description: 'ID del producto', example: 'prod-12345' })
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ description: 'Cantidad del producto', example: 2 })
    @IsNumber()
    @IsPositive()
    quantity: number;

    @ApiProperty({ description: 'Precio unitario del producto', example: 19.99 })
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiProperty({ description: 'Nombre del producto (opcional)', example: 'Camiseta', required: false })
    @IsString()
    @IsOptional()
    name?: string;
}

export class CreateOrderDto {
    @ApiProperty({ description: 'ID del cliente', example: 'cust-67890' })
    @IsString()
    @IsNotEmpty()
    customerId: string;

    @ApiProperty({
        description: 'Lista de items de la orden',
        type: [CreateOrderItemDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];

    @ApiProperty({
        description: 'Versión de la orden para control de concurrencia (opcional)',
        example: 1,
        required: false
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    version?: number;
}

// === ARCHIVO: api/src/common/dto/update-order.dto.ts ===
import { IsString, IsOptional, IsArray, ValidateNested, IsEnum, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../../domain/order.entity';

export class UpdateOrderItemDto {
  @ApiProperty({
    description: 'Identificador único del producto',
    example: 'prod-123',
    type: String,
  })
  @IsString()
  productId!: string;

  @ApiProperty({
    description: 'Cantidad del producto Ordered',
    example: 2,
    type: Number,
  })
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({
    description: 'Precio unitario del producto',
    example: 29.99,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({
    description: 'Nombre opcional del producto',
    example: 'Producto de Ejemplo',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  constructor(partial: Partial<UpdateOrderItemDto>) {
    this.productId = partial.productId ?? '';
    this.quantity = partial.quantity ?? 0;
    this.price = partial.price ?? 0;
    this.name = partial.name;
  }
}

export class UpdateOrderDto {
  @ApiPropertyOptional({
    description: 'Identificador del cliente que realiza la orden',
    example: 'cust-456',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiPropertyOptional({
    description: 'Lista de items de la orden',
    type: [UpdateOrderItemDto],
    required: false,
    example: [
      { productId: 'prod-123', quantity: 2, price: 29.99, name: 'Producto A' },
      { productId: 'prod-456', quantity: 1, price: 49.99, name: 'Producto B' },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  items?: UpdateOrderItemDto[];

  @ApiPropertyOptional({
    description: 'Estado de la orden',
    enum: OrderStatus,
    example: OrderStatus.PROCESSING,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Versión para control de concurrencia optimista',
    example: 1,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  version?: number;

  constructor(partial: Partial<UpdateOrderDto>) {
    this.customerId = partial.customerId;
    this.items = partial.items;
    this.status = partial.status;
    this.version = partial.version;
  }
}

// === ARCHIVO: api/src/common/filters/http-exception.filter.ts ===
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  method: string;
  traceId?: string;
  validationErrors?: Record<string, string[]>;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = this.buildErrorResponse(
      status,
      exceptionResponse,
      request,
    );

    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${status} - ${errorResponse.message}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }

  private buildErrorResponse(
    status: HttpStatus,
    exceptionResponse: string | object,
    request: Request,
  ): ErrorResponse {
    const timestamp = new Date().toISOString();
    const path = request.url;
    const method = request.method;

    let message: string;
    let error: string;
    let validationErrors: Record<string, string[]> | undefined;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      error = HttpStatus[status];
    } else {
      const resp = exceptionResponse as Record<string, unknown>;
      const respMessage = resp.message;
      
      if (Array.isArray(respMessage)) {
        message = respMessage.join(', ');
      } else if (typeof respMessage === 'string') {
        message = respMessage;
      } else {
        message = HttpStatus[status];
      }
      
      error = (resp.error as string) || HttpStatus[status];

      if (respMessage && Array.isArray(respMessage)) {
        validationErrors = this.extractValidationErrors(respMessage);
      }
    }

    return {
      statusCode: status,
      message,
      error,
      timestamp,
      path,
      method,
      traceId: (request.headers['x-trace-id'] as string) || undefined,
      validationErrors,
    };
  }

  private extractValidationErrors(
    messages: string[] | unknown,
  ): Record<string, string[]> | undefined {
    if (!Array.isArray(messages)) {
      return undefined;
    }

    const errors: Record<string, string[]> = {};

    for (const msg of messages) {
      if (typeof msg === 'string' && msg.includes(':')) {
        const [field, ...rest] = msg.split(':');
        const errorMessage = rest.join(':').trim();

        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(errorMessage);
      }
    }

    return Object.keys(errors).length > 0 ? errors : undefined;
  }
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      status = exception.getStatus();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;
        const respMessage = resp.message;
        
        if (Array.isArray(respMessage)) {
          message = respMessage.join(', ');
        } else if (typeof respMessage === 'string') {
          message = respMessage;
        }
        
        error = ((resp.error as string) || error);
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `[${request.method}] ${request.url} - ${exception.message}`,
        exception.stack,
      );
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      traceId: (request.headers['x-trace-id'] as string) || undefined,
    };

    response.status(status).json(errorResponse);
  }
}

// === ARCHIVO: api/src/common/interceptors/response.interceptor.ts ===
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Request, Response } from 'express';

export interface ApiResponse<T> {
  data?: T;
  meta?: {
    timestamp: string;
    path: string;
    method: string;
    duration: number;
    page?: number;
    limit?: number;
    total?: number;
  };
  message?: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, url } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log(
          `[${method}] ${url} - Status: ${response.statusCode} - Duration: ${duration}ms`,
        );
      }),
      map((data) => {
        const duration = Date.now() - startTime;
        const isPaginated = data && typeof data === 'object' && 'data' in data;

        const responsePayload: ApiResponse<T> = {
          data: isPaginated ? (data as { data: T }).data : data,
          meta: {
            timestamp: new Date().toISOString(),
            path: url,
            method,
            duration,
            ...(isPaginated && {
              page: (data as { page?: number }).page,
              limit: (data as { limit?: number }).limit,
              total: (data as { total?: number }).total,
            }),
          },
        };

        if (response.statusCode === HttpStatus.CREATED) {
          responsePayload.message = 'Recurso creado exitosamente';
        } else if (response.statusCode === HttpStatus.NO_CONTENT) {
          delete responsePayload.data;
          responsePayload.message = 'Recurso eliminado exitosamente';
        }

        return responsePayload;
      }),
    );
  }
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, headers, body } = request;
    const userAgent = headers['user-agent'] || '';
    const ip = headers['x-forwarded-for'] || request.ip || 'unknown';

    this.logger.log(
      `Incoming Request: ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`,
    );

    if (body && Object.keys(body).length > 0) {
      this.logger.debug(`Request Body: ${JSON.stringify(body)}`);
    }

    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log(
          `Request Completed: ${method} ${url} - Duration: ${duration}ms`,
        );
      }),
    );
  }
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, T | T[] | null>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T | T[] | null> {
    return next.handle().pipe(
      map((data) => {
        if (data === null || data === undefined) {
          return null;
        }

        if (Array.isArray(data)) {
          return data.map((item) => this.transformItem(item));
        }

        return this.transformItem(data);
      }),
    );
  }

  private transformItem(item: T): T {
    if (typeof item === 'object' && item !== null) {
      const transformed = { ...item } as Record<string, unknown>;

      for (const [key, value] of Object.entries(transformed)) {
        if (value instanceof Date) {
          transformed[key] = value.toISOString();
        }
      }

      return transformed as T;
    }

    return item;
  }
}

// === ARCHIVO: api/src/common/validators/order.validator.ts ===
import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { OrderItem, OrderStatus } from '../../domain/order.entity';

@ValidatorConstraint({ name: 'orderItems', async: false })
@Injectable()
export class OrderItemsValidator implements ValidatorConstraintInterface {
  validate(items: OrderItem[], args: ValidationArguments): boolean {
    if (!Array.isArray(items) || items.length === 0) {
      return false;
    }

    for (const item of items) {
      if (!item.productId || typeof item.productId !== 'string') {
        return false;
      }
      if (
        typeof item.quantity !== 'number' ||
        item.quantity <= 0 ||
        !Number.isInteger(item.quantity)
      ) {
        return false;
      }
      if (typeof item.price !== 'number' || item.price < 0) {
        return false;
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Cada item de la orden debe tener un productId válido, una cantidad mayor a 0 y un precio no negativo';
  }
}

@ValidatorConstraint({ name: 'validOrderStatus', async: false })
@Injectable()
export class ValidOrderStatusValidator implements ValidatorConstraintInterface {
  private readonly validStatuses = Object.values(OrderStatus);

  validate(status: string, args: ValidationArguments): boolean {
    if (!status || typeof status !== 'string') {
      return false;
    }
    return this.validStatuses.includes(status as OrderStatus);
  }

  defaultMessage(args: ValidationArguments): string {
    return `El estado de la orden debe ser uno de: ${this.validStatuses.join(', ')}`;
  }
}

@ValidatorConstraint({ name: 'orderStatusTransition', async: false })
@Injectable()
export class OrderStatusTransitionValidator implements ValidatorConstraintInterface {
  private readonly allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [
      OrderStatus.PROCESSING,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.PROCESSING]: [
      OrderStatus.SHIPPED,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELLED]: [],
  };

  validate(
    transition: { from: OrderStatus; to: OrderStatus },
    args: ValidationArguments,
  ): boolean {
    if (!transition || !transition.from || !transition.to) {
      return false;
    }

    const allowed = this.allowedTransitions[transition.from];
    if (!allowed || !Array.isArray(allowed)) {
      return false;
    }
    return allowed.includes(transition.to);
  }

  defaultMessage(args: ValidationArguments): string {
    return 'La transición de estado no es válida para esta orden';
  }
}

@ValidatorConstraint({ name: 'customerId', async: false })
@Injectable()
export class CustomerIdValidator implements ValidatorConstraintInterface {
  private readonly customerIdPattern = /^[A-Z0-9]{8,12}$/i;

  validate(customerId: string, args: ValidationArguments): boolean {
    if (!customerId || typeof customerId !== 'string') {
      return false;
    }
    return this.customerIdPattern.test(customerId);
  }

  defaultMessage(args: ValidationArguments): string {
    return 'El customerId debe ser un identificador alfanumérico de 8 a 12 caracteres';
  }
}

@ValidatorConstraint({ name: 'positiveTotalAmount', async: false })
@Injectable()
export class PositiveTotalAmountValidator implements ValidatorConstraintInterface {
  validate(totalAmount: number, args: ValidationArguments): boolean {
    if (typeof totalAmount !== 'number') {
      return false;
    }
    return totalAmount >= 0;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'El monto total debe ser un valor no negativo';
  }
}

@Injectable()
export class OrderValidationService {
  constructor(
    private readonly itemsValidator: OrderItemsValidator,
    private readonly statusValidator: ValidOrderStatusValidator,
    private readonly transitionValidator: OrderStatusTransitionValidator,
    private readonly customerIdValidator: CustomerIdValidator,
    private readonly totalAmountValidator: PositiveTotalAmountValidator,
  ) {}

  validateItems(items: OrderItem[]): boolean {
    return this.itemsValidator.validate(items, {} as ValidationArguments);
  }

  validateStatus(status: string): boolean {
    return this.statusValidator.validate(status, {} as ValidationArguments);
  }

  validateTransition(from: OrderStatus, to: OrderStatus): boolean {
    return this.transitionValidator.validate(
      { from, to },
      {} as ValidationArguments,
    );
  }

  validateCustomerId(customerId: string): boolean {
    return this.customerIdValidator.validate(customerId, {} as ValidationArguments);
  }

  validateTotalAmount(totalAmount: number): boolean {
    return this.totalAmountValidator.validate(totalAmount, {} as ValidationArguments);
  }

  getValidationErrorMessage(validator: ValidatorConstraintInterface): string {
    if (typeof validator.defaultMessage === 'function') {
      return validator.defaultMessage({} as ValidationArguments);
    }
    return 'Error de validación desconocido';
  }
}

// === ARCHIVO: api/src/application/order.service.ts ===
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { OrderRepository } from '../infrastructure/repositories/order.repository';
import { OrderEntity, OrderStatus } from '../domain/order.entity';
import { CreateOrderDto } from '../common/dto/create-order.dto';
import { UpdateOrderDto } from '../common/dto/update-order.dto';
import {
  OrderValidationService,
  OrderItemsValidator,
  ValidOrderStatusValidator,
  CustomerIdValidator,
} from '../common/validators/order.validator';

@Injectable()
export class OrderService {
  private readonly MAX_ITEMS_PER_ORDER = 100;
  private readonly MAX_QUANTITY_PER_ITEM = 999;
  private readonly MIN_ORDER_AMOUNT = 0.01;
  private readonly MAX_ORDER_AMOUNT = 1000000;

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly validationService: OrderValidationService,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<OrderEntity> {
    this.validateCreateOrderInput(dto);

    const items = dto.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
    }));

    const order = new OrderEntity(
      dto.customerId,
      items,
      OrderStatus.PENDING,
      undefined,
      undefined,
      undefined,
      undefined,
      dto.version ?? 1,
    );

    try {
      const createdOrder = await this.orderRepository.create(order);
      return createdOrder;
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException(
          'Ya existe una orden con el mismo ID. Por favor, intente de nuevo.',
        );
      }
      throw error;
    }
  }

  async getOrder(id: string): Promise<OrderEntity> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('El ID de la orden es requerido');
    }

    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    return order;
  }

  async updateOrder(id: string, dto: UpdateOrderDto): Promise<OrderEntity> {
    const existingOrder = await this.getOrder(id);

    if (dto.status !== undefined) {
      this.validateStatusTransition(existingOrder.status, dto.status);
      existingOrder.updateStatus(dto.status);
    }

    if (dto.items !== undefined) {
      this.validateItemsUpdate(dto.items);
      existingOrder.updateItems(
        dto.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        })),
      );
    }

    existingOrder.version += 1;
    existingOrder.updatedAt = new Date();

    const updatedOrder = await this.orderRepository.update(existingOrder);
    return updatedOrder;
  }

  async deleteOrder(id: string): Promise<void> {
    await this.getOrder(id);
    await this.orderRepository.delete(id);
  }

  async listOrders(customerId?: string): Promise<OrderEntity[]> {
    if (customerId) {
      if (!this.validationService.validateCustomerId(customerId)) {
        throw new BadRequestException(
          this.validationService.getValidationErrorMessage(
            new CustomerIdValidator(),
          ),
        );
      }
      return this.orderRepository.findByCustomerId(customerId);
    }

    return [];
  }

  private validateCreateOrderInput(dto: CreateOrderDto): void {
    if (!dto.customerId) {
      throw new BadRequestException('El customerId es requerido');
    }

    if (!this.validationService.validateCustomerId(dto.customerId)) {
      throw new BadRequestException(
        this.validationService.getValidationErrorMessage(
          new CustomerIdValidator(),
        ),
      );
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException(
        'La orden debe contener al menos un item',
      );
    }

    if (dto.items.length > this.MAX_ITEMS_PER_ORDER) {
      throw new BadRequestException(
        `La orden no puede tener más de ${this.MAX_ITEMS_PER_ORDER} items`,
      );
    }

    for (const item of dto.items) {
      if (item.quantity > this.MAX_QUANTITY_PER_ITEM) {
        throw new BadRequestException(
          `La cantidad del producto ${item.productId} excede el límite de ${this.MAX_QUANTITY_PER_ITEM}`,
        );
      }
    }

    if (
      !this.validationService.validateItems(
        dto.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
      )
    ) {
      throw new BadRequestException(
        this.validationService.getValidationErrorMessage(new OrderItemsValidator()),
      );
    }
  }

  private validateStatusTransition(
    currentStatus: OrderStatus,
    newStatus: string,
  ): void {
    if (!this.validationService.validateTransition(currentStatus, newStatus as OrderStatus)) {
      throw new BadRequestException(
        `No se puede cambiar el estado de ${currentStatus} a ${newStatus}`,
      );
    }
  }

  private validateItemsUpdate(
    items: Array<{ productId: string; quantity: number; price: number; name?: string }>,
  ): void {
    if (!items || items.length === 0) {
      throw new BadRequestException(
        'La orden debe contener al menos un item',
      );
    }

    if (items.length > this.MAX_ITEMS_PER_ORDER) {
      throw new BadRequestException(
        `La orden no puede tener más de ${this.MAX_ITEMS_PER_ORDER} items`,
      );
    }

    if (
      !this.validationService.validateItems(
        items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
      )
    ) {
      throw new BadRequestException(
        this.validationService.getValidationErrorMessage(new OrderItemsValidator()),
      );
    }
  }

  private isDuplicateKeyError(error: any): boolean {
    const errorMessage = error?.message || '';
    return (
      errorMessage.includes('DuplicateKey') ||
      errorMessage.includes('conditional check failed') ||
      error?.code === 'ConditionalCheckFailedException'
    );
  }
}

// === ARCHIVO: api/src/infrastructure/controllers/order.controller.ts ===
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OrderService } from '../../application/order.service';
import { CreateOrderDto } from '../../common/dto/create-order.dto';
import { UpdateOrderDto } from '../../common/dto/update-order.dto';
import { OrderEntity } from '../../domain/order.entity';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva orden' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Orden creada exitosamente',
    type: OrderEntity,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflicto al crear la orden',
  })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una orden por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la orden',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orden encontrada',
    type: OrderEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'ID de orden inválido',
  })
  async getOrder(@Param('id') id: string): Promise<OrderEntity> {
    return this.orderService.getOrder(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una orden existente' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la orden',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orden actualizada exitosamente',
    type: OrderEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de actualización inválidos',
  })
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una orden por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la orden',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Orden eliminada exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'ID de orden inválido',
  })
  async deleteOrder(@Param('id') id: string): Promise<void> {
    return this.orderService.deleteOrder(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar órdenes con filtros opcionales' })
  @ApiQuery({
    name: 'customerId',
    description: 'Filtrar órdenes por ID de cliente',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de órdenes',
    type: [OrderEntity],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Parámetros de consulta inválidos',
  })
  async listOrders(
    @Query('customerId') customerId?: string,
  ): Promise<OrderEntity[]> {
    return this.orderService.listOrders(customerId);
  }
}

// === ARCHIVO: api/src/main.ts ===
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter, GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor, LoggingInterceptor, TransformInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
    new TransformInterceptor(),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Orders API')
    .setDescription('API para gestión de órdenes con persistencia en DynamoDB')
    .setVersion('1.0')
    .addTag('orders', 'Operaciones CRUD para gestión de órdenes')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Ingrese el token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 30px 0 }
    `,
    customSiteTitle: 'Orders API - Documentación',
  });

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || '0.0.0.0';

  await app.listen(port, host);
  console.log(`🚀 Aplicación iniciada en http://${host}:${port}`);
  console.log(`📚 Documentación Swagger disponible en http://${host}:${port}/api/docs`);
}

bootstrap();

// === ARCHIVO: api/src/app.module.ts ===
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_FILTER, APP_PIPE } from '@nestjs/core';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { OrderController } from './infrastructure/controllers/order.controller';
import { OrderService } from './application/order.service';
import { OrderRepository } from './infrastructure/repositories/order.repository';
import {
  OrderItemsValidator,
  ValidOrderStatusValidator,
  OrderStatusTransitionValidator,
  CustomerIdValidator,
  PositiveTotalAmountValidator,
  OrderValidationService,
} from './common/validators/order.validator';
import { HttpExceptionFilter, GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor, LoggingInterceptor, TransformInterceptor } from './common/interceptors/response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [],
    }),
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: 'DYNAMODB_DOCUMENT_CLIENT',
      useFactory: (configService: ConfigService) => {
        const client = new DynamoDBClient({
          region: configService.get('AWS_REGION') || 'us-east-1',
          endpoint: configService.get('AWS_ENDPOINT'),
          credentials: configService.get('AWS_ACCESS_KEY_ID')
            ? {
                accessKeyId: configService.get('AWS_ACCESS_KEY_ID') || '',
                secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY') || '',
              }
            : undefined,
        });
        return DynamoDBDocumentClient.from(client, {
          marshallOptions: {
            removeUndefinedValues: true,
            convertClassInstanceToMap: true,
          },
          unmarshallOptions: {
            wrapNumbers: false,
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'DYNAMODB_TABLE_NAME',
      useFactory: (configService: ConfigService) => {
        return configService.get('DYNAMODB_TABLE_NAME') || 'orders';
      },
      inject: [ConfigService],
    },
    OrderRepository,
    OrderItemsValidator,
    ValidOrderStatusValidator,
    OrderStatusTransitionValidator,
    CustomerIdValidator,
    PositiveTotalAmountValidator,
    OrderValidationService,
    OrderService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new (require('@nestjs/common').ValidationPipe)({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
  exports: [OrderService, OrderRepository],
})
export class AppModule {}

// === ARCHIVO: api/test/jest-e2e.json ===
{
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}


// === ARCHIVO: client/package.json ===
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "prepare": "husky install"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.0",
    "@tanstack/react-query": "^5.14.2",
    "axios": "^1.6.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.49.2",
    "react-router-dom": "^6.22.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^16.3.3",
    "@testing-library/user-event": "^14.5.1",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "husky": "^8.0.3",
    "jsdom": "^23.0.1",
    "lint-staged": "^15.2.0",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.7.0",
    "vite": "^5.0.10",
    "vitest": "^1.0.4"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  },
  "prettier": {
    "semi": true,
    "singleQuote": true,
    "trailingComma": "es5",
    "printWidth": 100
  }
}

// === ARCHIVO: client/vite.config.ts ===
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          tanstack: ['@tanstack/react-query'],
          forms: ['react-hook-form', 'zod'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: true,
  },
  esbuild: {
    loader: 'tsx',
  },
  optimizeDeps: {
    include: ['react/jsx-runtime'],
  },
});

// === ARCHIVO: client/tsconfig.json ===
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": [
      "ES2020",
      "DOM",
      "DOM.Iterable"
    ],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "src/*"
      ],
      "@features/*": [
        "src/features/*"
      ],
      "@shared/*": [
        "src/shared/*"
      ]
    }
  },
  "include": [
    "src"
  ]
}


// === ARCHIVO: client/index.html ===
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Sistema de gestión de órdenes con persistencia en DynamoDB" />
    <meta name="theme-color" content="#2563eb" />
    <meta name="keywords" content="órdenes, DynamoDB, gestión, CRUD" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="robots" content="index, follow" />
    <title>Sistema de Gestión de Órdenes</title>
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #1f2937;
        background-color: #f9fafb;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      #root {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }
      .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        flex-direction: column;
        gap: 1rem;
      }
      .loading-spinner {
        width: 48px;
        height: 48px;
        border: 4px solid #e5e7eb;
        border-top-color: #2563eb;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .loading-text {
        color: #6b7280;
        font-size: 0.875rem;
      }
      .error-boundary {
        padding: 2rem;
        text-align: center;
        background-color: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 0.5rem;
        margin: 2rem;
      }
      .error-title {
        color: #dc2626;
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }
      .error-message {
        color: #7f1d1d;
        font-size: 0.875rem;
      }
    </style>
  </head>
  <body>
    <div id="root">
      <div class="loading-container">
        <div class="loading-spinner" role="status" aria-label="Cargando aplicación"></div>
        <span class="loading-text">Inicializando sistema de órdenes...</span>
      </div>
    </div>
    <noscript>
      <div style="padding: 2rem; text-align: center; background: #fef2f2; color: #991b1b;">
        <h1>JavaScript requerido</h1>
        <p>Esta aplicación requiere JavaScript para funcionar. Por favor, habilite JavaScript en su navegador.</p>
      </div>
    </noscript>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

// === ARCHIVO: client/src/features/orders/components/OrderForm.tsx ===
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderSchema, OrderFormData } from '../validators/order.validator';
import { Button } from '@shared/components/Button';

interface OrderFormProps {
  initialData?: OrderFormData;
  onSubmit: (data: OrderFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditMode?: boolean;
}

export function OrderForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditMode = false,
}: OrderFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: initialData || {
      customerName: '',
      customerEmail: '',
      items: [],
      shippingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'MX',
      },
      notes: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const watchedItems = watch('items');

  const handleAddItem = () => {
    const currentItems = watchedItems || [];
    setValue('items', [
      ...currentItems,
      { productId: '', productName: '', quantity: 1, unitPrice: 0 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    const currentItems = watchedItems || [];
    setValue(
      'items',
      currentItems.filter((_, i) => i !== index)
    );
  };

  const calculateTotal = (): number => {
    const items = watchedItems || [];
    return items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0
    );
  };

  const handleFormSubmit = (data: OrderFormData) => {
    onSubmit(data);
    if (!isEditMode) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {isEditMode ? 'Editar Orden' : 'Nueva Orden'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="customerName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre del Cliente
            </label>
            <input
              id="customerName"
              type="text"
              {...register('customerName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingresa el nombre completo"
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customerName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="customerEmail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo Electrónico
            </label>
            <input
              id="customerEmail"
              type="email"
              {...register('customerEmail')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="correo@ejemplo.com"
            />
            {errors.customerEmail && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customerEmail.message}
              </p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-md font-medium text-gray-800 mb-3">
            Dirección de Envío
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Calle
              </label>
              <input
                id="street"
                type="text"
                {...register('shippingAddress.street')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.shippingAddress?.street && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shippingAddress.street.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ciudad
              </label>
              <input
                id="city"
                type="text"
                {...register('shippingAddress.city')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.shippingAddress?.city && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shippingAddress.city.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Estado
              </label>
              <input
                id="state"
                type="text"
                {...register('shippingAddress.state')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.shippingAddress?.state && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shippingAddress.state.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Código Postal
              </label>
              <input
                id="zipCode"
                type="text"
                {...register('shippingAddress.zipCode')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.shippingAddress?.zipCode && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shippingAddress.zipCode.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                País
              </label>
              <select
                id="country"
                {...register('shippingAddress.country')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="MX">México</option>
                <option value="US">Estados Unidos</option>
                <option value="CA">Canadá</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-medium text-gray-800">Productos</h4>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddItem}
            >
              + Agregar Producto
            </Button>
          </div>

          {watchedItems && watchedItems.length > 0 ? (
            <div className="space-y-3">
              {watchedItems.map((_, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-start p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="ID Producto"
                      {...register(`items.${index}.productId`)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Nombre del Producto"
                      {...register(`items.${index}.productName`)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Cantidad"
                      {...register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                      min={1}
                    />
                    <input
                      type="number"
                      placeholder="Precio Unitario"
                      {...register(`items.${index}.unitPrice`, {
                        valueAsNumber: true,
                      })}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                      min={0}
                      step={0.01}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">
              No hay productos agregados. Haz clic en &quot;Agregar Producto&quot; para
              añadir uno.
            </p>
          )}

          {errors.items && (
            <p className="mt-2 text-sm text-red-600">{errors.items.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Notas Adicionales
          </label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Instrucciones especiales, preferencias, etc."
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="text-lg font-semibold text-gray-900">
            Total: ${calculateTotal().toFixed(2)}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting || isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading
                ? 'Guardando...'
                : isEditMode
                  ? 'Actualizar Orden'
                  : 'Crear Orden'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

// === ARCHIVO: client/src/features/orders/components/OrderList.tsx ===
import { useState } from 'react';
import { OrderItem } from './OrderItem';
import { Button } from '@shared/components/Button';
import { Modal } from '@shared/components/Modal';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderListProps {
  orders: Order[];
  isLoading?: boolean;
  onEdit: (order: Order) => void;
  onDelete: (orderId: string) => void;
  onViewDetails: (order: Order) => void;
}

export function OrderList({
  orders,
  isLoading = false,
  onEdit,
  onDelete,
  onViewDetails,
}: OrderListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'total' | 'customer'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        searchTerm === '' ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison =
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case 'total':
          comparison = b.total - a.total;
          break;
        case 'customer':
          comparison = a.customerName.localeCompare(b.customerName);
          break;
      }

      return sortOrder === 'asc' ? -comparison : comparison;
    });

  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      onDelete(orderToDelete);
      setDeleteModalOpen(false);
      setOrderToDelete(null);
    }
  };

  const toggleSort = (field: 'date' | 'total' | 'customer') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'processing':
        return 'Procesando';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando órdenes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por cliente, email o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="processing">Procesando</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>

        <div className="mt-3 flex gap-2 text-sm">
          <span className="text-gray-600">Ordenar por:</span>
          <button
            onClick={() => toggleSort('date')}
            className={`px-2 py-1 rounded ${
              sortBy === 'date'
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Fecha {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => toggleSort('total')}
            className={`px-2 py-1 rounded ${
              sortBy === 'total'
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Total {sortBy === 'total' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => toggleSort('customer')}
            className={`px-2 py-1 rounded ${
              sortBy === 'customer'
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Cliente {sortBy === 'customer' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay órdenes
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'No se encontraron órdenes con los filtros aplicados.'
              : 'Comienza creando una nueva orden.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            Mostrando {filteredOrders.length} de {orders.length} órdenes
          </div>
          {filteredOrders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              onEdit={() => onEdit(order)}
              onDelete={() => handleDeleteClick(order.id)}
              onViewDetails={() => onViewDetails(order)}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmar Eliminación"
      >
        <div className="p-4">
          <p className="text-gray-700 mb-6">
            ¿Estás seguro de que deseas eliminar esta orden? Esta acción no se
            puede deshacer.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// === ARCHIVO: client/src/features/orders/components/OrderItem.tsx ===
import { useState } from 'react';
import { Button } from '@shared/components/Button';
import { Modal } from '@shared/components/Modal';

interface OrderItemData {
  id: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderItemProps {
  order: OrderItemData;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
  getStatusColor: (status: OrderItemData['status']) => string;
  getStatusLabel: (status: OrderItemData['status']) => string;
}

export function OrderItem({
  order,
  onEdit,
  onDelete,
  onViewDetails,
  getStatusColor,
  getStatusLabel,
}: OrderItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const getItemCount = () => {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const openDetailsModal = () => {
    setDetailsModalOpen(true);
    onViewDetails();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div
          className="p-4 cursor-pointer"
          onClick={toggleExpanded}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleExpanded();
            }
          }}
          aria-expanded={isExpanded}
          aria-label={`Detalles de la orden ${order.id}`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-mono text-gray-500">
                  #{order.id.slice(0, 8).toUpperCase()}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {order.customerName}
              </h3>
              <p className="text-sm text-gray-600">{order.customerEmail}</p>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span>{getItemCount()} productos</span>
                <span>•</span>
                <span>{formatCurrency(order.total)}</span>
                <span>•</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openDetailsModal();
                }}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                aria-label="Ver detalles de la orden"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                aria-label="Editar orden"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Eliminar orden"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Dirección de Envío
                  </h4>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.street}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                    <br />
                    {order.shippingAddress.zipCode},{' '}
                    {order.shippingAddress.country}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Productos
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.productName} x{item.quantity} ={' '}
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {order.notes && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Notas
                  </h4>
                  <p className="text-sm text-gray-600">{order.notes}</p>
                </div>
              )}

              <div className="mt-4 text-xs text-gray-400">
                <p>Creada: {formatDate(order.createdAt)}</p>
                <p>Última actualización: {formatDate(order.updatedAt)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={`Orden #${order.id.slice(0, 8).toUpperCase()}`}
      >
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-600">Estado:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusLabel(order.status)}
            </span>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Cliente</h4>
            <p className="text-gray-700">{order.customerName}</p>
            <p className="text-gray-600">{order.customerEmail}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Dirección de Envío
            </h4>
            <p className="text-gray-700">{order.shippingAddress.street}</p>
            <p className="text-gray-700">
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.zipCode}
            </p>
            <p className="text-gray-700">{order.shippingAddress.country}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Productos</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Producto</th>
                  <th className="text-right py-2">Cant.</th>
                  <th className="text-right py-2">Precio</th>
                  <th className="text-right py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2">{item.productName}</td>
                    <td className="text-right py-2">{item.quantity}</td>
                    <td className="text-right py-2">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="text-right py-2">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold">
                  <td colSpan={3} className="text-right py-3">
                    Total:
                  </td>
                  <td className="text-right py-3">
                    {formatCurrency(order.total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {order.notes && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Notas</h4>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
            <p>ID: {order.id}</p>
            <p>Creada: {formatDate(order.createdAt)}</p>
            <p>Actualizada: {formatDate(order.updatedAt)}</p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setDetailsModalOpen(false)}
            >
              Cerrar
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setDetailsModalOpen(false);
                onEdit();
              }}
            >
              Editar Orden
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

// === ARCHIVO: client/src/features/orders/services/order.service.ts ===
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderEntity {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: ShippingAddress;
  total: number;
  status?: OrderStatus;
  notes?: string;
}

export interface UpdateOrderDto {
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  items?: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: ShippingAddress;
  total?: number;
  status?: OrderStatus;
  notes?: string;
}

export interface OrderListQueryParams {
  customerId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface OrderFormData {
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
}

export function orderFormDataToCreateOrderDto(formData: OrderFormData): CreateOrderDto {
  const total = formData.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return {
    customerId: formData.customerEmail,
    customerName: formData.customerName,
    customerEmail: formData.customerEmail,
    items: formData.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.unitPrice,
    })),
    shippingAddress: formData.shippingAddress,
    total,
    status: 'pending',
    notes: formData.notes,
  };
}

class OrderService {
  private readonly client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async createOrder(data: CreateOrderDto): Promise<OrderEntity> {
    const response = await this.client.post<OrderEntity>('/orders', data);
    return response.data;
  }

  async getOrder(id: string): Promise<OrderEntity> {
    const response = await this.client.get<OrderEntity>(`/orders/${id}`);
    return response.data;
  }

  async updateOrder(id: string, data: UpdateOrderDto): Promise<OrderEntity> {
    const response = await this.client.put<OrderEntity>(`/orders/${id}`, data);
    return response.data;
  }

  async deleteOrder(id: string): Promise<void> {
    await this.client.delete(`/orders/${id}`);
  }

  async listOrders(params?: OrderListQueryParams): Promise<OrderEntity[]> {
    const response = await this.client.get<OrderEntity[]>('/orders', { params });
    return response.data;
  }
}

export const orderService = new OrderService();

// === ARCHIVO: client/src/features/orders/hooks/useOrders.ts ===
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  orderService,
  CreateOrderDto,
  UpdateOrderDto,
  OrderEntity,
  OrderListQueryParams,
} from '../services/order.service';

const ORDER_QUERY_KEY = 'orders';
const ORDER_DETAIL_KEY = 'order';

export interface UseOrdersOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useOrders(params?: OrderListQueryParams, options?: UseOrdersOptions) {
  const queryClient = useQueryClient();

  const query = useQuery<OrderEntity[], Error>({
    queryKey: [ORDER_QUERY_KEY, params],
    queryFn: () => orderService.listOrders(params),
    staleTime: 30000,
    gcTime: 300000,
  });

  const createMutation = useMutation<OrderEntity, Error, CreateOrderDto>({
    mutationFn: (data) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY] });
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });

  const updateMutation = useMutation<
    OrderEntity,
    Error,
    { id: string; data: UpdateOrderDto }
  >({
    mutationFn: ({ id, data }) => orderService.updateOrder(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY] });
      queryClient.setQueryData([ORDER_DETAIL_KEY, data.id], data);
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: (id) => orderService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY] });
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });

  return {
    orders: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createOrder: createMutation.mutate,
    createOrderAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    updateOrder: updateMutation.mutate,
    updateOrderAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    deleteOrder: deleteMutation.mutate,
    deleteOrderAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
}

export function useOrder(id: string, options?: UseOrdersOptions) {
  const queryClient = useQueryClient();

  const query = useQuery<OrderEntity, Error>({
    queryKey: [ORDER_DETAIL_KEY, id],
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
    staleTime: 30000,
    gcTime: 300000,
  });

  const updateMutation = useMutation<
    OrderEntity,
    Error,
    { id: string; data: UpdateOrderDto }
  >({
    mutationFn: ({ id, data }) => orderService.updateOrder(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData([ORDER_DETAIL_KEY, data.id], data);
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: (id) => orderService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDER_DETAIL_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY] });
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });

  return {
    order: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    updateOrder: updateMutation.mutate,
    updateOrderAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    deleteOrder: deleteMutation.mutate,
    deleteOrderAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
}

// === ARCHIVO: client/src/shared/components/Button.tsx ===
import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  outline: 'bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyle = variantStyles[variant];
    const sizeStyle = sizeStyles[size];
    const widthStyle = fullWidth ? 'w-full' : '';

    const focusRingColor =
      variant === 'primary' || variant === 'danger'
        ? 'focus:ring-indigo-500'
        : 'focus:ring-gray-500';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyle} ${sizeStyle} ${widthStyle} ${focusRingColor} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Cargando...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

// === ARCHIVO: client/src/shared/components/Modal.tsx ===
import React, { useEffect, useRef, ReactNode, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  footer?: ReactNode;
}

const sizeClasses: Record<ModalProps['size'], string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);

      setTimeout(() => {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements && focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        }
      }, 50);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);

      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        className={`relative bg-white rounded-xl shadow-2xl transform transition-all ${sizeClasses[size]} w-full`}
        style={{
          animation: 'modalSlideIn 0.2s ease-out',
        }}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            {title && (
              <h2
                id="modal-title"
                className="text-xl font-semibold text-gray-900"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Cerrar modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;

// === ARCHIVO: client/src/shared/hooks/useForm.ts ===
import { useState, useCallback, useEffect } from 'react';
import { FieldValues, SubmitHandler, FieldError } from 'react-hook-form';
import { z, ZodSchema } from 'zod';

export interface UseFormOptions<T extends FieldValues> {
  defaultValues: Partial<T>;
  schema?: ZodSchema<T>;
  onSubmit: SubmitHandler<T>;
}

export interface UseFormReturnType<T extends FieldValues> {
  register: (name: keyof T, options?: RegisterOptions) => {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
    ref: (instance: HTMLInputElement | null) => void;
    name: string;
    value?: string;
  };
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  reset: (values?: Partial<T>) => void;
  setValue: (name: keyof T, value: unknown) => void;
  getValues: () => T;
  watch: (name?: keyof T) => unknown;
  errors: Partial<Record<keyof T, FieldError>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

interface RegisterOptions {
  required?: string | boolean;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: Record<string, string | ((value: unknown) => string | boolean)>;
}

export function useForm<T extends FieldValues>(
  options: UseFormOptions<T>
): UseFormReturnType<T> {
  const { defaultValues, schema, onSubmit } = options;

  const [values, setValues] = useState<Partial<T>>(defaultValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, FieldError>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const validateField = useCallback(
    (name: keyof T, value: unknown): string | null => {
      if (!schema) return null;

      const fieldSchema = (schema as z.ZodObject<Record<string, z.ZodTypeAny>>).shape[name];
      if (!fieldSchema) return null;

      try {
        fieldSchema.parse(value);
        return null;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors.find((e) => e.path[0] === name);
          return fieldError ? fieldError.message : null;
        }
        return null;
      }
    },
    [schema]
  );

  const validateAll = useCallback((): boolean => {
    if (!schema) return true;

    try {
      schema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof T, FieldError>> = {};
        error.errors.forEach((err) => {
          const fieldName = err.path[0] as keyof T;
          newErrors[fieldName] = {
            type: err.code,
            message: err.message,
            ref: { name: fieldName as string } as HTMLInputElement,
          };
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [schema, values]);

  const register = useCallback(
    (name: keyof T, _options?: RegisterOptions) => {
      return {
        name: name as string,
        value: values[name] as string | undefined,
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = event.target.value;
          setValues((prev) => ({ ...prev, [name]: newValue }));
          setIsDirty(true);

          const errorMessage = validateField(name, newValue);
          setErrors((prev) => {
            const newErrors = { ...prev };
            if (errorMessage) {
              newErrors[name] = {
                type: 'validation',
                message: errorMessage,
                ref: { name: name as string } as HTMLInputElement,
              };
            } else {
              delete newErrors[name];
            }
            return newErrors;
          });
        },
        onBlur: () => {
          const value = values[name];
          const errorMessage = validateField(name, value);
          setErrors((prev) => {
            const newErrors = { ...prev };
            if (errorMessage) {
              newErrors[name] = {
                type: 'validation',
                message: errorMessage,
                ref: { name: name as string } as HTMLInputElement,
              };
            }
            return newErrors;
          });
        },
        ref: (instance: HTMLInputElement | null) => {
          if (instance) {
            instance.value = (values[name] as string) || '';
          }
        },
      };
    },
    [values, validateField]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      setIsSubmitting(true);

      const keys = Object.keys(values) as unknown as (keyof T)[];
      const isValid = validateAll();

      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      try {
        await onSubmit(values as T);
        setIsDirty(false);
      } catch (error) {
        console.error('Error en el envío del formulario:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit, validateAll]
  );

  const reset = useCallback(
    (newValues?: Partial<T>) => {
      setValues(newValues || defaultValues);
      setErrors({});
      setIsDirty(false);
    },
    [defaultValues]
  );

  const setValue = useCallback((name: keyof T, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  }, []);

  const getValues = useCallback((): T => {
    return values as T;
  }, [values]);

  const watch = useCallback(
    (name?: keyof T): unknown => {
      if (name) {
        return values[name];
      }
      return values;
    },
    [values]
  );

  useEffect(() => {
    if (schema) {
      validateAll();
    }
  }, []);

  const isValid = Object.keys(errors).length === 0;

  return {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    errors,
    isSubmitting,
    isValid,
    isDirty,
  };
}

export default useForm;

// === ARCHIVO: client/src/shared/services/api.client.ts ===
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:3000';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderEntity {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface CreateOrderDto {
  customerId: string;
  customerName: string;
  items: OrderItem[];
}

interface UpdateOrderDto {
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items?: OrderItem[];
}

interface ListOrdersParams {
  customerId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private buildQueryString(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  async createOrder(data: CreateOrderDto): Promise<OrderEntity> {
    const config: AxiosRequestConfig<CreateOrderDto> = {
      method: 'POST',
      url: '/orders',
      data,
    };
    const response: AxiosResponse<OrderEntity> = await this.client.request(config);
    return response.data;
  }

  async getOrder(id: string): Promise<OrderEntity> {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/orders/${id}`,
    };
    const response: AxiosResponse<OrderEntity> = await this.client.request(config);
    return response.data;
  }

  async updateOrder(id: string, data: UpdateOrderDto): Promise<OrderEntity> {
    const config: AxiosRequestConfig<UpdateOrderDto> = {
      method: 'PUT',
      url: `/orders/${id}`,
      data,
    };
    const response: AxiosResponse<OrderEntity> = await this.client.request(config);
    return response.data;
  }

  async deleteOrder(id: string): Promise<void> {
    const config: AxiosRequestConfig = {
      method: 'DELETE',
      url: `/orders/${id}`,
    };
    await this.client.request(config);
  }

  async listOrders(params?: ListOrdersParams): Promise<OrderEntity[]> {
    const url = params
      ? `/orders${this.buildQueryString(params as Record<string, unknown>)}`
      : '/orders';
    const config: AxiosRequestConfig = {
      method: 'GET',
      url,
    };
    const response: AxiosResponse<OrderEntity[]> = await this.client.request(config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export type { OrderEntity, CreateOrderDto, UpdateOrderDto, OrderItem, ListOrdersParams };

// === ARCHIVO: client/src/shared/utils/validators.ts ===
import { z } from 'zod';

export const orderItemSchema = z.object({
  productId: z.string().min(1, 'El ID del producto es requerido'),
  productName: z.string().min(1, 'El nombre del producto es requerido'),
  quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
  price: z.number().positive('El precio debe ser mayor a 0'),
});

export const createOrderSchema = z.object({
  customerId: z.string().min(1, 'El ID del cliente es requerido'),
  customerName: z.string().min(1, 'El nombre del cliente es requerido'),
  items: z
    .array(orderItemSchema)
    .min(1, 'Debe incluir al menos un producto en la orden'),
});

export const updateOrderSchema = z.object({
  status: z
    .enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
    .optional(),
  items: z.array(orderItemSchema).min(1, 'Debe incluir al menos un producto').optional(),
});

export const orderStatusValues = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;
export type OrderStatus = (typeof orderStatusValues)[number];

export function validateCreateOrder(data: unknown) {
  return createOrderSchema.safeParse(data);
}

export function validateUpdateOrder(data: unknown) {
  return updateOrderSchema.safeParse(data);
}

export function validateEmail(email: string): boolean {
  const emailSchema = z.string().email('Email inválido');
  const result = emailSchema.safeParse(email);
  return result.success;
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

export function validateRequired(value: unknown, fieldName: string): string | null {
  if (value === undefined || value === null || value === '') {
    return `${fieldName} es requerido`;
  }
  return null;
}

export function validateMinLength(value: string, min: number, fieldName: string): string | null {
  if (value.length < min) {
    return `${fieldName} debe tener al menos ${min} caracteres`;
  }
  return null;
}

export function validateMaxLength(value: string, max: number, fieldName: string): string | null {
  if (value.length > max) {
    return `${fieldName} no puede exceder ${max} caracteres`;
  }
  return null;
}

export function validatePositiveNumber(value: number, fieldName: string): string | null {
  if (value <= 0) {
    return `${fieldName} debe ser mayor a 0`;
  }
  return null;
}

export function validateDateRange(startDate: string, endDate: string): string | null {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start > end) {
    return 'La fecha de inicio debe ser anterior a la fecha fin';
  }
  return null;
}

export function getFieldErrors<T>(errors: z.ZodError): Record<keyof T, string> {
  const fieldErrors: Record<string, string> = {};
  errors.errors.forEach((error) => {
    const path = error.path.join('.');
    if (!fieldErrors[path]) {
      fieldErrors[path] = error.message;
    }
  });
  return fieldErrors as Record<keyof T, string>;
}

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;

// === ARCHIVO: client/src/main.tsx ===
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('No se encontró el elemento root en el DOM');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);

// === ARCHIVO: client/src/App.tsx ===
import { Routes, Route, Navigate } from 'react-router-dom';
import OrdersPage from './features/orders/OrdersPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Sistema de Gestión de Órdenes
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © 2024 Sistema de Gestión de Órdenes. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

// === ARCHIVO: client/src/features/orders/OrdersPage.tsx ===
import { useState, useCallback } from 'react';
import { OrderEntity, CreateOrderDto, UpdateOrderDto } from './services/order.service';
import { useOrders } from './hooks/useOrders';
import { Button } from '../../shared/components/Button';
import { Modal } from '../../shared/components/Modal';
import { OrderForm } from './components/OrderForm';
import { OrderList } from './components/OrderList';

export interface OrderFormData {
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

function orderEntityToOrder(entity: OrderEntity) {
  return {
    id: entity.id,
    customerName: '',
    customerEmail: '',
    items: entity.items.map((item) => ({
      productId: item.productId,
      productName: '',
      quantity: item.quantity,
      price: item.price,
    })),
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    total: entity.total,
    status: entity.status,
    notes: undefined,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

function orderFormDataToCreateOrderDto(data: OrderFormData): CreateOrderDto {
  return {
    customerId: data.customerId,
    items: data.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    })),
    total: data.total,
    status: data.status,
  };
}

function orderFormDataToUpdateOrderDto(data: OrderFormData): UpdateOrderDto {
  return {
    customerId: data.customerId,
    items: data.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    })),
    total: data.total,
    status: data.status,
  };
}

interface OrdersPageState {
  isFormModalOpen: boolean;
  editingOrder: OrderEntity | null;
  selectedOrder: OrderEntity | null;
  isDetailsModalOpen: boolean;
  searchQuery: string;
  statusFilter: string;
}

const initialState: OrdersPageState = {
  isFormModalOpen: false,
  editingOrder: null,
  selectedOrder: null,
  isDetailsModalOpen: false,
  searchQuery: '',
  statusFilter: '',
};

function OrdersPage() {
  const [state, setState] = useState<OrdersPageState>(initialState);

  const handleOrderSuccess = useCallback(() => {
    closeFormModal();
  }, []);

  const handleOrderError = useCallback((err: Error) => {
    console.error('Error en operación de órdenes:', err.message);
  }, []);

  const {
    orders,
    isLoading,
    error,
    createOrder,
    updateOrder,
    deleteOrder,
    refetch,
  } = useOrders({
    onSuccess: handleOrderSuccess,
    onError: handleOrderError,
  });

  const openCreateModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isFormModalOpen: true,
      editingOrder: null,
    }));
  }, []);

  const openEditModal = useCallback((order: OrderEntity) => {
    setState((prev) => ({
      ...prev,
      isFormModalOpen: true,
      editingOrder: order,
    }));
  }, []);

  const closeFormModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isFormModalOpen: false,
      editingOrder: null,
    }));
  }, []);

  const openDetailsModal = useCallback((order: OrderEntity) => {
    setState((prev) => ({
      ...prev,
      selectedOrder: order,
      isDetailsModalOpen: true,
    }));
  }, []);

  const closeDetailsModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedOrder: null,
      isDetailsModalOpen: false,
    }));
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const handleStatusFilterChange = useCallback((status: string) => {
    setState((prev) => ({ ...prev, statusFilter: status }));
  }, []);

  const handleSubmit = useCallback(
    async (data: OrderFormData) => {
      try {
        if (state.editingOrder) {
          const updateDto = orderFormDataToUpdateOrderDto(data);
          await updateOrder({
            id: state.editingOrder.id,
            data: updateDto,
          });
        } else {
          const createDto = orderFormDataToCreateOrderDto(data);
          await createOrder(createDto);
        }
      } catch (err) {
        console.error('Error al guardar orden:', err);
        throw err;
      }
    },
    [state.editingOrder, createOrder, updateOrder]
  );

  const handleDelete = useCallback(
    async (orderId: string) => {
      if (window.confirm('¿Está seguro de que desea eliminar esta orden?')) {
        try {
          await deleteOrder(orderId);
          refetch();
        } catch (err) {
          console.error('Error al eliminar orden:', err);
        }
      }
    },
    [deleteOrder, refetch]
  );

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !state.searchQuery ||
      order.id.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      order.customerId.toLowerCase().includes(state.searchQuery.toLowerCase());

    const matchesStatus =
      !state.statusFilter || order.status === state.statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  const ordersForList = sortedOrders.map(orderEntityToOrder);

  const getStatusColor = useCallback((status: string): string => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      processing: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }, []);

  const getStatusLabel = useCallback((status: string): string => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
      processing: 'Procesando',
      completed: 'Completado',
    };
    return labels[status] || status;
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }, []);

  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }, []);

  const handleEditFromList = useCallback(
    (order: { id: string }) => {
      const found = orders.find((o) => o.id === order.id);
      if (found) {
        openEditModal(found);
      }
    },
    [orders, openEditModal]
  );

  const handleDeleteFromList = useCallback(
    (order: { id: string }) => {
      handleDelete(order.id);
    },
    [handleDelete]
  );

  const handleViewDetailsFromList = useCallback(
    (order: { id: string }) => {
      const found = orders.find((o) => o.id === order.id);
      if (found) {
        openDetailsModal(found);
      }
    },
    [orders, openDetailsModal]
  );

  const initialFormData: OrderFormData | undefined = state.editingOrder
    ? {
        customerId: state.editingOrder.customerId,
        customerName: '',
        customerEmail: '',
        items: state.editingOrder.items.map((item) => ({
          productId: item.productId,
          productName: '',
          quantity: item.quantity,
          price: item.price,
        })),
        total: state.editingOrder.total,
        status: state.editingOrder.status,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Gestión de Órdenes
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Administra las órdenes de tus clientes
          </p>
        </div>
        <Button onClick={openCreateModal} variant="primary">
          Nueva Orden
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">
            Error al cargar las órdenes: {error.message}
          </p>
        </div>
      )}

      <OrderList
        orders={ordersForList}
        isLoading={isLoading}
        onEdit={handleEditFromList}
        onDelete={handleDeleteFromList}
        onViewDetails={handleViewDetailsFromList}
        searchQuery={state.searchQuery}
        statusFilter={state.statusFilter}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        getStatusColor={getStatusColor}
        getStatusLabel={getStatusLabel}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
      />

      <Modal
        isOpen={state.isFormModalOpen}
        onClose={closeFormModal}
        title={state.editingOrder ? 'Editar Orden' : 'Nueva Orden'}
        size="xl"
      >
        <OrderForm
          initialData={initialFormData}
          onSubmit={handleSubmit}
          onCancel={closeFormModal}
          isLoading={isLoading}
          isEditMode={!!state.editingOrder}
        />
      </Modal>

      <Modal
        isOpen={state.isDetailsModalOpen}
        onClose={closeDetailsModal}
        title="Detalles de la Orden"
        size="lg"
      >
        {state.selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">ID de Orden</h4>
                <p className="text-gray-900 font-mono text-sm">
                  {state.selectedOrder.id}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Estado</h4>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    state.selectedOrder.status
                  )}`}
                >
                  {getStatusLabel(state.selectedOrder.status)}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">ID de Cliente</h4>
                <p className="text-gray-900">
                  {state.selectedOrder.customerId || 'No especificado'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Total</h4>
                <p className="text-gray-900 font-semibold">
                  {formatCurrency(state.selectedOrder.total)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Fecha de Creación</h4>
                <p className="text-gray-900">
                  {formatDate(state.selectedOrder.createdAt)}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">
                Productos ({state.selectedOrder.items.length})
              </h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID Producto
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio Unitario
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {state.selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.productId}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {state.selectedOrder.updatedAt && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Última Actualización</h4>
                <p className="text-gray-900">
                  {formatDate(state.selectedOrder.updatedAt)}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button variant="secondary" onClick={closeDetailsModal}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default OrdersPage;

// === ARCHIVO: client/src/index.css ===
/* Estilos pendientes: archivo creado automaticamente porque otro modulo lo importa. */


// === ARCHIVO: client/src/setupTests.ts ===
// Setup de tests generado automaticamente (referenciado por la config del runner).
// Agrega aca matchers globales o mocks compartidos.
export {};


// === ARCHIVO: client/src/features/orders/validators/order.validator.ts ===
import { z } from 'zod';

export const orderSchema = z.object({
  customerName: z.string().min(1, 'El nombre del cliente es requerido').max(100, 'Máximo 100 caracteres'),
  customerEmail: z.string().email('Correo electrónico inválido'),
  items: z.array(
    z.object({
      productId: z.string().min(1, 'ID del producto requerido'),
      productName: z.string().min(1, 'Nombre del producto requerido'),
      quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
      unitPrice: z.number().min(0, 'El precio no puede ser negativo'),
    })
  ).min(1, 'Debe incluir al menos un producto'),
  shippingAddress: z.object({
    street: z.string().min(1, 'La calle es requerida').max(200, 'Máximo 200 caracteres'),
    city: z.string().min(1, 'La ciudad es requerida').max(100, 'Máximo 100 caracteres'),
    state: z.string().min(1, 'El estado es requerido').max(100, 'Máximo 100 caracteres'),
    zipCode: z.string().min(1, 'El código postal es requerido').max(20, 'Máximo 20 caracteres'),
    country: z.string().min(2, 'El país es requerido').max(2, 'Código de país inválido'),
  }),
  notes: z.string().max(500, 'Máximo 500 caracteres').optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;

// === ARCHIVO: infra/providers.tf ===
# Configuración de providers para Terraform
# Este archivo declara los proveedores necesarios para desplegar la infraestructura
# y especifica las versiones exactas para garantizar consistencia.

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.40.0"
    }
  }
}

# Provider principal para AWS
# Configura la región por defecto y permite la personalización mediante variables.
provider "aws" {
  region = var.aws_region

  # Tags por defecto para todos los recursos
  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}

# Provider para us-east-1 (requerido para algunos servicios globales como Route53)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}

# Variables globales esperadas por este archivo



// === ARCHIVO: infra/variables.tf ===
# Variables globales para la configuración de la infraestructura
# Estas variables son utilizadas por múltiples módulos y recursos.

# Variables de entorno y proyecto
variable "environment" {
  description = "Ambiente de despliegue (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Nombre del proyecto para etiquetar recursos"
  type        = string
  default     = "orders-management-20261110090352996"
}

variable "aws_region" {
  description = "Región de AWS donde se desplegará la infraestructura"
  type        = string
  default     = "us-east-1"
}

# Variables para DynamoDB
variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para ordenes"
  type        = string
  default     = "orders"
}

variable "dynamodb_billing_mode" {
  description = "Modo de facturación para DynamoDB (PROVISIONED o PAY_PER_REQUEST)"
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "dynamodb_read_capacity" {
  description = "Capacidad de lectura provisionada (solo aplicable si billing_mode es PROVISIONED)"
  type        = number
  default     = 5
}

variable "dynamodb_write_capacity" {
  description = "Capacidad de escritura provisionada (solo aplicable si billing_mode es PROVISIONED)"
  type        = number
  default     = 5
}

variable "dynamodb_hash_key" {
  description = "Nombre del atributo clave hash para la tabla DynamoDB"
  type        = string
  default     = "order_id"
}

variable "dynamodb_range_key" {
  description = "Nombre del atributo clave range para la tabla DynamoDB (opcional)"
  type        = string
  default     = "created_at"
}

variable "dynamodb_ttl_attribute" {
  description = "Nombre del atributo para Time To Live (TTL) en DynamoDB (opcional)"
  type        = string
  default     = "expires_at"
}

variable "dynamodb_global_secondary_indexes" {
  description = "Lista de índices secundarios globales para la tabla DynamoDB"
  type = list(object({
    name               = string
    hash_key           = string
    range_key          = optional(string)
    projection_type    = string
    read_capacity      = optional(number)
    write_capacity     = optional(number)
    non_key_attributes = optional(list(string), [])
  }))
  default = [
    {
      name               = "customer_id-index"
      hash_key           = "customer_id"
      projection_type    = "INCLUDE"
      non_key_attributes = ["order_status", "total_amount"]
    }
  ]
}

# Variables para API Gateway
variable "api_gateway_name" {
  description = "Nombre del API Gateway"
  type        = string
  default     = "orders-api"
}

variable "api_gateway_stage_name" {
  description = "Nombre del stage para el API Gateway"
  type        = string
  default     = "dev"
}

# Variables para Lambda
variable "lambda_function_name" {
  description = "Nombre de la función Lambda para manejar operaciones CRUD"
  type        = string
  default     = "orders-crud-handler"
}

variable "lambda_runtime" {
  description = "Runtime para la función Lambda"
  type        = string
  default     = "nodejs20.x"
}

variable "lambda_handler" {
  description = "Handler para la función Lambda"
  type        = string
  default     = "index.handler"
}

variable "lambda_memory_size" {
  description = "Memoria asignada a la función Lambda (en MB)"
  type        = number
  default     = 128
}

variable "lambda_timeout" {
  description = "Tiempo máximo de ejecución para la función Lambda (en segundos)"
  type        = number
  default     = 3
}

// === ARCHIVO: infra/modules/dynamodb/variables.tf ===
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

// === ARCHIVO: infra/environments/dev/terraform.tfvars ===
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

// === ARCHIVO: infra/README.md ===
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

// === ARCHIVO: infra/terraform.tfvars ===
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

// === ARCHIVO: infra/modules/dynamodb/main.tf ===
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

// === ARCHIVO: infra/versions.tf ===
# =============================================================================
# CONFIGURACIÓN DE VERSIONES DE TERRAFORM
# La configuración del backend se encuentra en backend.tf
# La configuración de providers se encuentra en providers.tf
# =============================================================================
terraform {
  required_version = ">= 1.6.0"
}

// === ARCHIVO: infra/main.tf ===
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

// === ARCHIVO: infra/outputs.tf ===
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

// === ARCHIVO: infra/backend.tf ===
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

// === ARCHIVO: infra/modules/dynamodb/outputs.tf ===
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

// === ARCHIVO: infra/modules/api-gateway/main.tf ===
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

// === ARCHIVO: docker-compose.yml ===
# Infraestructura local del reto. SOLO desarrollo: credenciales de ejemplo (local-dev-only), puertos en loopback.
# Levantar: docker compose up -d --wait
name: infra-local
services:
  dynamodb-local:
    image: "amazon/dynamodb-local:2.5.2"
    command: ["-jar","DynamoDBLocal.jar","-sharedDb","-inMemory"]
    ports:
      - "127.0.0.1:8000:8000"
    healthcheck:
      test: ["CMD-SHELL","bash -c ':> /dev/tcp/127.0.0.1/8000' || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 5s


// === ARCHIVO: infra-local/README.md ===
# Infraestructura local

Servicios de soporte para el reto, definidos en `docker-compose.yml` (raiz del repo).

```bash
docker compose up -d --wait
```

| Servicio | Imagen | Puertos (host) |
|---|---|---|
| DynamoDB Local | `amazon/dynamodb-local:2.5.2` | 8000 |

Credenciales: solo de desarrollo local (`local-dev-only`, `local`). No son secretos ni deben reutilizarse.
Los scripts de `infra-local/` (tablas, topics) se ejecutan con el compose en estado healthy.


// === ARCHIVO: infra-local/dynamodb/create-tables.sh ===
#!/usr/bin/env bash
# Crea las tablas en DynamoDB Local (idempotente). Credenciales dummy: DynamoDB Local no valida firmas.
set -euo pipefail

export AWS_ACCESS_KEY_ID=local
export AWS_SECRET_ACCESS_KEY=local
export AWS_REGION=us-east-1
ENDPOINT="${DYNAMODB_ENDPOINT:-http://localhost:8000}"

create_table() {
  local name="$1" pk="$2" sk="${3:-}"
  if aws dynamodb describe-table --table-name "$name" --endpoint-url "$ENDPOINT" >/dev/null 2>&1; then
    echo "Tabla $name ya existe"
    return
  fi
  local attrs="AttributeName=$pk,AttributeType=S"
  local keys="AttributeName=$pk,KeyType=HASH"
  if [ -n "$sk" ]; then
    attrs="$attrs AttributeName=$sk,AttributeType=S"
    keys="$keys AttributeName=$sk,KeyType=RANGE"
  fi
  # shellcheck disable=SC2086
  aws dynamodb create-table --table-name "$name" --attribute-definitions $attrs --key-schema $keys \
    --billing-mode PAY_PER_REQUEST --endpoint-url "$ENDPOINT" >/dev/null
  echo "Tabla $name creada"
}

create_table "app-items" "id"

```
