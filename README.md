# Implementación de operaciones CRUD de ordenes en DynamoDB

El sistema de gestión de ordenes requiere la implementación de operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en DynamoDB desde la interfaz de usuario. La aplicación se ejecuta en un entorno e2e con el identificador 20261110090352996. El objetivo es gestionar ordenes de manera eficiente y versionar la infraestructura utilizando Terraform.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | Persistir ordenes en DynamoDB desde la interfaz |
| **Nivel** | advanced-l2 |
| **Tipo** | practical |
| **Tiempo estimado** | 8 horas |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y entregará cada archivo con su ruta.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y entregará cada archivo con su ruta. Guárdalos en la carpeta donde quieras trabajar, respetando las rutas.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no entrega todos los archivos al terminar el análisis, escríbele: "entrégame todos los archivos con su ruta".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Configuración inicial y creación de ordenes

**Objetivo:** Configurar el entorno de desarrollo y permitir la creación de nuevas ordenes en DynamoDB.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Configura el entorno de desarrollo utilizando Terraform para versionar la infraestructura.
- Implementa la funcionalidad para crear nuevas ordenes en DynamoDB desde la interfaz.
- Asegúrate de que la creación de ordenes cumpla con las validaciones necesarias (por ejemplo, campos obligatorios, formato de datos).

**Entregable:** Entorno de desarrollo configurado y funcionalidad de creación de ordenes implementada.

<details>
<summary>Pistas de conocimiento</summary>

- Utiliza Terraform para gestionar la infraestructura.
- Implementa validaciones en el frontend para asegurar la integridad de los datos al crear ordenes.

</details>

### Fase 2: Lectura y actualización de ordenes

**Objetivo:** Implementar la funcionalidad para leer y actualizar ordenes existentes en DynamoDB.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Implementa la funcionalidad para leer ordenes existentes en DynamoDB desde la interfaz.
- Agrega la funcionalidad para actualizar ordenes existentes en DynamoDB desde la interfaz.
- Asegúrate de que la lectura y actualización de ordenes cumplan con las validaciones necesarias (por ejemplo, existencia de la orden, permisos de acceso).

**Entregable:** Funcionalidad de lectura y actualización de ordenes implementada.

<details>
<summary>Pistas de conocimiento</summary>

- Implementa mecanismos de autenticación y autorización para asegurar que solo usuarios autorizados puedan leer y actualizar ordenes.
- Utiliza Terraform para versionar los cambios en la infraestructura.

</details>

### Fase 3: Eliminación de ordenes y versionado de infraestructura

**Objetivo:** Implementar la funcionalidad para eliminar ordenes existentes en DynamoDB y versionar la infraestructura utilizando Terraform.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- Implementa la funcionalidad para eliminar ordenes existentes en DynamoDB desde la interfaz.
- Asegúrate de que la eliminación de ordenes cumpla con las validaciones necesarias (por ejemplo, confirmación del usuario, permisos de acceso).
- Versiona los cambios en la infraestructura utilizando Terraform.

**Entregable:** Funcionalidad de eliminación de ordenes implementada y cambios en la infraestructura versionados.

<details>
<summary>Pistas de conocimiento</summary>

- Implementa mecanismos de confirmación para asegurar que la eliminación de ordenes sea intencional.
- Utiliza Terraform para versionar los cambios en la infraestructura y asegurar la trazabilidad de las modificaciones.

</details>

## Dimensiones Evaluadas

- **queEs**: ¿Qué son las operaciones CRUD y por qué son importantes en la gestión de ordenes?
- **paraQueSirve**: ¿Para qué sirve versionar la infraestructura utilizando Terraform en este contexto?
- **comoSeUsa**: ¿Cómo se usa DynamoDB para almacenar y recuperar ordenes en este sistema?
- **erroresComunes**: ¿Cuáles son los errores comunes que pueden ocurrir al implementar operaciones CRUD en DynamoDB y cómo se pueden evitar?
- **queDecisionesImplica**: ¿Qué decisiones implica la implementación de operaciones CRUD en DynamoDB desde la interfaz y cómo se pueden justificar?

## Criterios de Evaluacion

- Configuración inicial del entorno de desarrollo utilizando Terraform.
- Implementación de la funcionalidad para crear nuevas ordenes en DynamoDB desde la interfaz.
- Implementación de la funcionalidad para leer ordenes existentes en DynamoDB desde la interfaz.
- Implementación de la funcionalidad para actualizar ordenes existentes en DynamoDB desde la interfaz.
- Implementación de la funcionalidad para eliminar ordenes existentes en DynamoDB desde la interfaz.
- Versionado de los cambios en la infraestructura utilizando Terraform.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT) si no tenes un agente en el IDE. Declara lo mismo que AGENTS.md; los archivos que te devuelva el chat los guardas en esta carpeta respetando las rutas.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

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

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*
