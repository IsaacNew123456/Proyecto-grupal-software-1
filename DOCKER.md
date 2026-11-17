# ErgoCheck AI — Guía de Despliegue con Docker y AWS

Este documento detalla la infraestructura de contenedores de **ErgoCheck AI**, cómo ejecutarla localmente con Docker Compose y cómo realizar el despliegue hacia **Amazon Web Services (AWS)**.

---

## 🏗️ Arquitectura de Contenedores

```
                 [Internet / Clientes]
               (Navegador Web / App Móvil)
                          │
                          ▼ :80 / :443
               ┌─────────────────────┐
               │  ergocheck-frontend │ (Nginx Alpine + SPA React 19)
               └──────────┬──────────┘
                          │ /api/* (Proxy Inverso & WebSockets)
                          ▼ :3000
               ┌─────────────────────┐
               │   ergocheck-backend │ (NestJS + Prisma Client)
               └──────────┬──────────┘
                          │ :5432
                          ▼
               ┌─────────────────────┐
               │  ergocheck-postgres │ (PostgreSQL 16 Alpine + Volumen)
               └─────────────────────┘
```

---

## 🚀 1. Ejecución Local con Docker Compose

### Requisitos Previos
* Tener instalado **Docker Desktop** (con Docker Compose v2+).

### Pasos

1. **Construir y levantar todos los servicios:**
   ```bash
   docker compose up --build -d
   ```

2. **Verificar estado de los contenedores:**
   ```bash
   docker compose ps
   ```

3. **Ejecutar migraciones y datos iniciales de Prisma en la base de datos de Docker:**
   ```bash
   docker compose exec backend npx prisma db push
   docker compose exec backend npm run prisma:seed
   ```

4. **Acceder a los servicios:**
   * **Frontend Web:** `http://localhost` (o `http://localhost:5173`)
   * **API Docs (Swagger):** `http://localhost:3000/api/docs`
   * **Backend API:** `http://localhost:3000/api`

5. **Detener los servicios:**
   ```bash
   docker compose down
   ```
   *(Para borrar también los datos de la base de datos: `docker compose down -v`)*

---

## ☁️ 2. Guía de Despliegue en AWS

### Opción A: AWS EC2 (Rápido y Económico — Ideal para Demo / MVP)

1. **Crear una instancia EC2:**
   * Tipo: `t3.small` o `t3.medium`.
   * SO: Ubuntu Server 24.04 LTS.
   * Security Group: Abrir puertos `80` (HTTP), `443` (HTTPS) y `22` (SSH).

2. **Instalar Docker y Docker Compose en la EC2:**
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose-v2
   sudo usermod -aG docker $USER
   ```

3. **Clonar el proyecto y levantar:**
   ```bash
   git clone <tu-repositorio>
   cd "Proyecto Lopez"
   docker compose up --build -d
   ```

4. **Certificado SSL Gratuito con Let's Encrypt / Certbot:**
   * Configura tu dominio apuntando a la IP pública de la EC2 y genera el certificado HTTPS.

---

### Opción B: AWS ECS Fargate + RDS (Nivel Empresarial / Auto-escalable)

1. **Base de Datos Gestionada:**
   * Crear una instancia **AWS RDS PostgreSQL** (Multi-AZ para alta disponibilidad).
   * Configurar `DATABASE_URL` del backend apuntando al endpoint de RDS.

2. **Subir imágenes a AWS ECR (Elastic Container Registry):**
   ```bash
   # Autenticar Docker con tu cuenta de AWS
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <tu-cuenta>.dkr.ecr.us-east-1.amazonaws.com

   # Construir y etiquetar backend
   docker build -t ergocheck-backend ./backend
   docker tag ergocheck-backend:latest <tu-cuenta>.dkr.ecr.us-east-1.amazonaws.com/ergocheck-backend:latest
   docker push <tu-cuenta>.dkr.ecr.us-east-1.amazonaws.com/ergocheck-backend:latest

   # Construir y etiquetar frontend
   docker build -t ergocheck-frontend ./frontend
   docker tag ergocheck-frontend:latest <tu-cuenta>.dkr.ecr.us-east-1.amazonaws.com/ergocheck-frontend:latest
   docker push <tu-cuenta>.dkr.ecr.us-east-1.amazonaws.com/ergocheck-frontend:latest
   ```

3. **Orquestar en AWS ECS Fargate / AWS App Runner:**
   * Crear un **Application Load Balancer (ALB)** con certificado ACM (SSL gratis de AWS).
   * Definir las *Task Definitions* con las imágenes de ECR y desplegar el servicio ECS Fargate.

---

## 📱 Conexión con la App Móvil (`movil`)

La aplicación móvil de React Native compilada en APK no se aloja en Docker. Para que se comunique con tu backend en AWS:

1. Edita `movil/src/services/api.ts`:
   ```typescript
   export const API_BASE_URL = 'https://tu-dominio-aws.com/api';
   ```
2. Genera el APK de producción con EAS:
   ```bash
   cd movil
   eas build -p android --profile production
   ```
