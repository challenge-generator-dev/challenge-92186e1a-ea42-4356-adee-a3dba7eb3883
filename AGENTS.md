# AGENTS.md

Instrucciones para el agente de IA que abra este repositorio (Claude Code, Cursor, Codex, Copilot, Gemini). Se cargan solas: no hay que pegar nada en ningun chat.

## Que es este repositorio

Es el codigo base de un reto de aprendizaje de Pragma: **Implementación de operaciones CRUD de ordenes en DynamoDB**.

| | |
|---|---|
| Tema | Persistir ordenes en DynamoDB desde la interfaz |
| Nivel | advanced-l2 |
| Chapter | Frontend |
| Especialidad | React |
| Stack | TypeScript / React 19 |
| Patron arquitectonico | componentes contenedor/presentacional + hooks personalizados |
| Tiempo estimado | 8 horas |

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

## Receta del stack

Esqueleto obligatorio:

- `package.json, vite.config.ts y tsconfig.json en la raiz`
- `src/main.tsx como entry point`
- `src/app con el arbol de rutas`
- `src/features con componentes contenedores y sus hooks`
- `src/shared con componentes presentacionales`
- `src/services con los clientes HTTP`

Trampas conocidas:

- No inventes versiones de npm: una version inexistente hace fallar `npm install` con ETARGET. `@types/react-router-dom` ya no se publica para v6+, React Router trae sus tipos.
- El `package.json` tiene que ser JSON valido y UNICO: nada despues de la llave de cierre.

Dependencias:

- react 19.0.0
- react-dom 19.0.0
- react-router-dom 6.22.0
- @types/react n/a
- @types/react-dom n/a
- @vitejs/plugin-react 4.2.1
- typescript 5.7.0
- vite 5.0.10
- axios 1.6.2
- react-hook-form 7.49.2
- zod 3.22.4
- @tanstack/react-query 5.14.2
- tailwindcss n/a
- autoprefixer n/a
- postcss n/a

## Tu tarea

Dejar este proyecto en estado **verificable**: que el comando de verificacion corra sin errores. Escribi los archivos en disco, en este repositorio. No generes ZIPs ni archivos adjuntos.

En orden:

1. Segui el orden de arranque del mapa de componentes (infraestructura local primero) y corre `(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q` desde la raiz: mira que falla.
2. Completa lo que falte de la lista de abajo: manifiesto de dependencias, punto de entrada, capa de interfaz y las capas del patron declarado.
3. Arregla SOLO los errores que impiden compilar o arrancar.
4. Volve a correr `(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q` hasta que pase.
5. Pará ahí.

## Regla dura: las fases son trabajo del humano

**PROHIBIDO implementar los entregables de las fases.** El valor del reto esta en que la persona los resuelva. Tu trabajo es que tenga un proyecto que arranca; el hueco pedagogico se queda como esta.

No resuelvas nada de esto:

- **Fase 1 — Configuración inicial y creación de ordenes**: Entorno de desarrollo configurado y funcionalidad de creación de ordenes implementada.
- **Fase 2 — Lectura y actualización de ordenes**: Funcionalidad de lectura y actualización de ordenes implementada.
- **Fase 3 — Eliminación de ordenes y versionado de infraestructura**: Funcionalidad de eliminación de ordenes implementada y cambios en la infraestructura versionados.

Distincion operativa:

- **Arreglar** (si): import faltante, tipo que no existe, dependencia sin declarar, error de sintaxis, archivo referenciado que no existe.
- **No tocar** (no): logica de negocio incompleta, validaciones ausentes, secretos hardcodeados, APIs deprecadas que funcionan, concurrencia insegura, patrones mejorables. Eso es lo que la persona tiene que encontrar.

## Lo que falta y tenes que completar

### 1. Referencias colgando (2)

Salieron de un analisis estatico del codigo que SI esta en el repo. Cada una rompe la compilacion:

- [ ] `api/src/domain/order.entity.ts` — `OrderItem.reduce`
      Se invoca `reduce` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `api/src/domain/order.entity.ts` — `OrderItem.some`
      Se invoca `some` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

### Presentes (50)

- `api/package.json`
- `api/tsconfig.json`
- `api/src/domain/order.entity.ts`
- `api/src/infrastructure/repositories/order.repository.ts`
- `api/src/common/dto/create-order.dto.ts`
- `api/src/common/dto/update-order.dto.ts`
- `api/src/common/filters/http-exception.filter.ts`
- `api/src/common/interceptors/response.interceptor.ts`
- `api/src/common/validators/order.validator.ts`
- `api/src/application/order.service.ts`
- `api/src/infrastructure/controllers/order.controller.ts`
- `api/src/main.ts`
- `api/src/app.module.ts`
- `api/test/jest-e2e.json`
- `client/package.json`
- `client/vite.config.ts`
- `client/tsconfig.json`
- `client/index.html`
- `client/src/features/orders/components/OrderForm.tsx`
- `client/src/features/orders/components/OrderList.tsx`
- `client/src/features/orders/components/OrderItem.tsx`
- `client/src/features/orders/services/order.service.ts`
- `client/src/features/orders/hooks/useOrders.ts`
- `client/src/shared/components/Button.tsx`
- `client/src/shared/components/Modal.tsx`
- `client/src/shared/hooks/useForm.ts`
- `client/src/shared/services/api.client.ts`
- `client/src/shared/utils/validators.ts`
- `client/src/main.tsx`
- `client/src/App.tsx`
- `client/src/features/orders/OrdersPage.tsx`
- `client/src/index.css`
- `client/src/setupTests.ts`
- `client/src/features/orders/validators/order.validator.ts`
- `infra/providers.tf`
- `infra/variables.tf`
- `infra/modules/dynamodb/variables.tf`
- `infra/environments/dev/terraform.tfvars`
- `infra/README.md`
- `infra/terraform.tfvars`
- `infra/modules/dynamodb/main.tf`
- `infra/versions.tf`
- `infra/main.tf`
- `infra/outputs.tf`
- `infra/backend.tf`
- `infra/modules/dynamodb/outputs.tf`
- `infra/modules/api-gateway/main.tf`
- `docker-compose.yml`
- `infra-local/README.md`
- `infra-local/dynamodb/create-tables.sh`

### Capas del patron declarado

Cada una tiene que existir como directorio real con al menos un archivo. Codigo plano en la raiz no satisface el patron.

- `api`
- `api/src`
- `api/src/domain`
- `api/src/application`
- `api/src/infrastructure`
- `api/src/infrastructure/controllers`
- `api/src/infrastructure/repositories`
- `api/src/common`
- `client`
- `client/src`
- `client/src/features`
- `client/src/features/orders`
- `client/src/features/orders/components`
- `client/src/features/orders/hooks`
- `client/src/features/orders/services`
- `client/src/shared`
- `client/src/shared/components`
- `client/src/shared/hooks`
- `client/src/shared/services`
- `infra`
- `infra/modules`
- `infra/modules/dynamodb`
- `infra/modules/api-gateway`
- `infra/modules/lambda`

## Verificacion

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q
```

Ese comando pasando es la definicion de "terminado" para vos.

## Convenciones que tenes que respetar

- Un solo ecosistema: no declares librerias de otro lenguaje ni mezcles gestores de paquetes.
- Toda libreria que uses tiene que estar declarada en el manifiesto de dependencias.
- Todo import declarado tiene que usarse; todo tipo usado tiene que existir o venir de una dependencia declarada.
- Cada componente vive en su carpeta: instala y compila dentro de ella, y no muevas archivos entre componentes.
- Respeta los contratos entre componentes (endpoints, topics) tal como estan declarados en el mapa de componentes.
- El patron es **componentes contenedor/presentacional + hooks personalizados**: los contratos (interfaces, puertos) los define la capa interna y los implementa la externa, nunca al revés.
- Los archivos que crees llevan implementacion real, no stubs: sin `TODO`, sin cuerpos vacios, sin `// getters y setters`.

## Contexto del candidato

Sirve para calibrar el nivel del codigo, no para resolver las fases.

- Perfil: Chapter Frontend, Especialidad Desarrollador, Tecnología React, Advanced L2
- Brecha que el reto ataca: CRUD de ordenes en DynamoDB desde la interfaz (corrida e2e 20261110090352996), Implementa operaciones CRUD de ordenes en DynamoDB desde la interfaz y versiona la infraestructura
- Mision: Gestionar ordenes

---

*Generado por Challenge Generator — Pragma. `README.md` tiene el enunciado completo del reto para la persona. `PROMPT_MEJORA.md` es la variante para pegar en un chat, si se prefiere ese flujo.*
