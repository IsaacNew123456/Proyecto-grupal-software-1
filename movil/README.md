# ErgoCheck AI — Aplicación Móvil (React Native + Expo)

> **Smart Companion & Asistente Móvil de Teletrabajo y Ergonomía**

Esta aplicación móvil complementaria se conecta al ecosistema de ErgoCheck AI para brindar **notificaciones hápticas en tiempo real**, **control de pausas de teletrabajo** y **auditoría móvil de incidentes**.

---

## 🚀 Cómo Ejecutar la App

Desde la raíz del proyecto o entrando a la carpeta `movil/`:

```bash
cd movil
npm run start
```

Opciones de ejecución:
- Presiona `a` para abrir en un **Emulador de Android**.
- Presiona `w` para abrir en el **Navegador Web** (Vista previa inmediata).
- Escanea el código QR con la app **Expo Go** en tu dispositivo físico Android o iOS.

---

## 📱 Módulos y Funcionalidades por Rol

### 1. Colaborador (`EMPLEADO`)
- **Semáforo Postural en Vivo:** Estado ergonómico sincronizado con el procesamiento Edge AI de la PC (Verde: Óptimo, Amarillo: Fatiga, Rojo: Riesgo RULA alto).
- **Alerta de Inclinación de Cuello y Espalda:** Feedback háptico (vibración) para corregir la postura inmediatamente sin interrumpir la pantalla de la computadora.
- **Detección de Ausencia en Teletrabajo:** Notificación al dejar el puesto > 15 minutos, con modal para **Justificar Pausa con 1 tap** (*Pausa Activa*, *Refrigerio*, *Llamada Laboral*).
- **Pausas Activas Guiadas:** Micro-rutina de 2 minutos (Regla 20-20-20 visual, retracción cervical y rotación escapular).
- **Simulador Interactivo:** Botones para probar en vivo la reacción háptica y visual de las alertas.

### 2. Supervisor de Equipo (`SUPERVISOR` / `EVALUADOR`)
- **Mosaico Semafórico Resumido:** Monitoreo en vivo de los puestos asignados (En Foco, Fatiga, Incidente, En Pausa).
- **Auditoría Móvil:** Botones rápidos para *Confirmar Falta*, *Desestimar/Justificar* o marcar *Falso Positivo* desde el celular.
- **Alertas Críticas:** Notificación push instantánea si un miembro del equipo incurre en abandono de puesto o incidentes graves.

### 3. Jefatura de SST / RRHH (`ADMIN_ORGANIZACION`)
- **Consola Ejecutiva de Salud Ocupacional:** % de cumplimiento ergonómico corporativo, puestos de teletrabajo activos y desglose de riesgo por área/departamento.

### 4. Operador de Negocio (`SUPER_ADMINISTRADOR`)
- **Salud del Ecosistema SaaS:** Empresas activas, puestos en vivo en tiempo real y latencia de infraestructura.

### 5. Control de Candidatos (`POSTULANTE`)
- **Bloqueo Informativo Amigable:** Si un postulante intenta acceder, la app le indica que su evaluación requiere computadora de escritorio con cámara web y navegador compatible, evitando accesos no autorizados.

---

## 🎨 Especificaciones de Diseño y Código

- **Tema Visual:** Dark Tech B2B SaaS (`#0B1020` con acento oficial Lime Tech `#C6F432`).
- **Iconografía:** Exclusivamente vectorial con `lucide-react-native` (cero emojis).
- **Isotipo Oficial:** `LogoErgoCheck` renderizado vectorialmente con `react-native-svg`.
- **Almacenamiento Cifrado:** Tokens JWT resguardados con `expo-secure-store`.
- **Límite Estricto de Código:** Todos los archivos modulares se mantienen por debajo de las 250 líneas.
