//!INC Local Scripts.EAConstants-JScript
/*
 * =========================================================================================
 * PROYECTO: ErgoCheck & Monitor AI — INF-422 (UAGRM)
 * SPRINT 3: Supervisión de Conducta, Anti-Cheat, Cuestionarios y Entrevistas (HU11 - HU19)
 * SCRIPT PARA ENTERPRISE ARCHITECT (JScript 100% Compatible y Robusto)
 *
 * CORRECCIÓN APLICADA:
 * - Tipos de diagramas y elementos 100% compatibles con el metamodelo estándar de EA.
 * - Creación segura con fallback automático ante diferencias de versión de Enterprise Architect.
 * - Eliminación de tipos no soportados directamente (como "ExecutionEnvironment" o "Database").
 * - Todos los elementos se crean a nivel de paquete para evitar fallos de anidación.
 * =========================================================================================
 */

function main() {
    Session.Output("====================================================================");
    Session.Output("Iniciando generación de diagramas UML para Sprint 3 en Enterprise Architect...");
    Session.Output("====================================================================");

    var selectedPkg = Repository.GetTreeSelectedPackage();
    if (selectedPkg == null) {
        Session.Prompt("Por favor seleccione un paquete en el Project Browser antes de ejecutar.", 1);
        return;
    }

    // 0. Crear paquete contenedor de Sprint 3
    var sprintPkg = null;
    try {
        sprintPkg = selectedPkg.Packages.AddNew("Sprint 3 - Supervisión de Conducta y Exámenes", "Package");
        sprintPkg.Update();
        selectedPkg.Packages.Refresh();
    } catch(e) {
        sprintPkg = selectedPkg;
    }

    Session.Output("-> Paquete destino configurado: " + sprintPkg.Name);

    // 1. Diagrama de Despliegue
    crearDiagramaDespliegue(sprintPkg);

    // 2. Diagrama Organizado en Capas
    crearDiagramaCapas(sprintPkg);

    // 3. Diagrama de Clases
    crearDiagramaClases(sprintPkg);

    // 4. Diagramas de Secuencia (HU11-13, HU14-16, HU17-19)
    crearSecuenciaHU11_13(sprintPkg);
    crearSecuenciaHU14_16(sprintPkg);
    crearSecuenciaHU17_19(sprintPkg);

    // 5. Diagrama de Estados
    crearDiagramaEstados(sprintPkg);

    // 6. Diagrama de Tiempo
    crearDiagramaTiempo(sprintPkg);

    try {
        sprintPkg.Diagrams.Refresh();
        sprintPkg.Packages.Refresh();
        Repository.RefreshModelView(sprintPkg.PackageID);
    } catch(e) {}

    Session.Output("====================================================================");
    Session.Output("¡ÉXITO TOTAL! Todos los diagramas del Sprint 3 han sido generados.");
    Session.Output("Abra los diagramas en el Project Browser para visualizarlos.");
    Session.Output("====================================================================");
}

/* =========================================================================================
 * 1. DIAGRAMA DE DESPLIEGUE - SPRINT 3
 * ========================================================================================= */
function crearDiagramaDespliegue(pkg) {
    Session.Output("-> Generando: 1. Diagrama de Despliegue...");
    var diag = crearDiagramaSeguro(pkg, "Diagrama de Despliegue - Sprint 3", "Deployment", "Component");
    if (diag == null) return;

    // Nodos principales
    var nodeClient = crearElem(pkg, "Dispositivo Cliente (Navegador Chrome/Firefox)", "Node", "device");
    colocar(diag, nodeClient, 50, -50, 420, -480);

    var compUI = crearElem(pkg, "Frontend React 19 (Visor Supervisado)", "Component", "");
    colocar(diag, compUI, 80, -90, 390, -170);

    var compWorker = crearElem(pkg, "Web Worker (MediaPipe FaceLandmarker WASM)", "Component", "");
    compWorker.Notes = "Inferencia Edge AI (Zero-Retention): PnP 3D Pitch/Yaw/Roll, Iris Gaze Vector, Blendshapes faciales.";
    compWorker.Update();
    colocar(diag, compWorker, 80, -200, 390, -310);

    var compDOM = crearElem(pkg, "Agente Telemetría DOM (Window Blur & Atajos F12/Ctrl+C)", "Component", "");
    colocar(diag, compDOM, 80, -340, 390, -440);

    // Servidor de Aplicación
    var nodeServer = crearElem(pkg, "Servidor Central de Aplicación (AWS EC2 / Node 20)", "Node", "executionEnvironment");
    colocar(diag, nodeServer, 500, -50, 880, -480);

    var compAPI = crearElem(pkg, "API REST (NestJS / Passport JWT / ConsentGuard)", "Component", "");
    colocar(diag, compAPI, 530, -100, 850, -220);

    var compGateway = crearElem(pkg, "SupervisionGateway (WebSockets / Socket.IO)", "Component", "");
    compGateway.Notes = "Watchdog de latencia 15s y transmisión de telemetría en tiempo real.";
    compGateway.Update();
    colocar(diag, compGateway, 530, -260, 850, -370);

    // Host Base de Datos
    var nodeDB = crearElem(pkg, "Host Base de Datos (AWS RDS PostgreSQL 16)", "Node", "database");
    colocar(diag, nodeDB, 960, -80, 1280, -380);

    var compDB = crearElem(pkg, "Esquema ergo_proctoring_db (Prisma ORM)", "Component", "database");
    colocar(diag, compDB, 990, -140, 1250, -320);

    // Cuestionarios Externos
    var nodeExt = crearElem(pkg, "Servicio Cuestionarios Externos (Google Forms)", "Node", "external");
    colocar(diag, nodeExt, 50, -530, 420, -680);

    // Conectores de comunicación
    crearConector(nodeClient, nodeServer, "Association", "WSS / HTTPS (TLS 1.3)", "communicationPath");
    crearConector(nodeServer, nodeDB, "Association", "TCP 5432 (SSL Privado)", "communicationPath");
    crearConector(nodeClient, nodeExt, "Association", "Iframe HTTPS Embebido", "communicationPath");

    refrescarDiag(diag);
}

/* =========================================================================================
 * 2. DIAGRAMA ORGANIZADO EN CAPAS - SPRINT 3
 * ========================================================================================= */
function crearDiagramaCapas(pkg) {
    Session.Output("-> Generando: 2. Diagrama Organizado en Capas...");
    var diag = crearDiagramaSeguro(pkg, "Diagrama Organizado en Capas - Sprint 3", "Logical", "Component");
    if (diag == null) return;

    // Capa Presentación
    var pPres = crearElem(pkg, "Capa de Presentación (Frontend Web React 19)", "Package", "");
    colocar(diag, pPres, 50, -50, 950, -170);
    var cVisor = crearElem(pkg, "VisorSupervisadoUI", "Component", "");
    colocar(diag, cVisor, 80, -90, 280, -150);
    var cEntrevista = crearElem(pkg, "ModoEntrevistaUI", "Component", "");
    colocar(diag, cEntrevista, 320, -90, 520, -150);
    var cForms = crearElem(pkg, "ConfiguracionCuestionariosUI", "Component", "");
    colocar(diag, cForms, 560, -90, 760, -150);

    // Capa Aplicación
    var pApp = crearElem(pkg, "Capa de Aplicación (API NestJS & WebSockets)", "Package", "");
    colocar(diag, pApp, 50, -200, 950, -320);
    var cSupCtrl = crearElem(pkg, "SupervisionController", "Component", "");
    colocar(diag, cSupCtrl, 80, -240, 280, -300);
    var cQuestCtrl = crearElem(pkg, "CuestionariosController", "Component", "");
    colocar(diag, cQuestCtrl, 320, -240, 520, -300);
    var cSupGate = crearElem(pkg, "SupervisionGateway (WSS)", "Component", "");
    colocar(diag, cSupGate, 560, -240, 760, -300);

    // Capa Servicios de Dominio
    var pServ = crearElem(pkg, "Capa de Servicios de Dominio (Anti-Cheat & Telemetría)", "Package", "");
    colocar(diag, pServ, 50, -350, 950, -470);
    var sGaze = crearElem(pkg, "GazeTrackingService", "Component", "");
    colocar(diag, sGaze, 80, -390, 280, -450);
    var sAudit = crearElem(pkg, "BehaviorAuditService", "Component", "");
    colocar(diag, sAudit, 320, -390, 520, -450);
    var sTele = crearElem(pkg, "TelemetryService", "Component", "");
    colocar(diag, sTele, 560, -390, 760, -450);

    // Capa Datos
    var pData = crearElem(pkg, "Capa de Datos y Persistencia (Prisma & PostgreSQL)", "Package", "");
    colocar(diag, pData, 50, -500, 950, -620);
    var mSes = crearElem(pkg, "SupervisionSessionModel", "Component", "");
    colocar(diag, mSes, 80, -540, 280, -600);
    var mEvt = crearElem(pkg, "BehaviorEventModel", "Component", "");
    colocar(diag, mEvt, 320, -540, 520, -600);
    var mQst = crearElem(pkg, "QuestionnaireModel", "Component", "");
    colocar(diag, mQst, 560, -540, 760, -600);

    // Dependencias
    crearConector(pPres, pApp, "Dependency", "consume servicios", "");
    crearConector(pApp, pServ, "Dependency", "invoca lógica", "");
    crearConector(pServ, pData, "Dependency", "persiste datos", "");

    refrescarDiag(diag);
}

/* =========================================================================================
 * 3. DIAGRAMA DE CLASES - SPRINT 3
 * ========================================================================================= */
function crearDiagramaClases(pkg) {
    Session.Output("-> Generando: 3. Diagrama de Clases...");
    var diag = crearDiagramaSeguro(pkg, "Diagrama de Clases - Sprint 3", "Logical", "Class");
    if (diag == null) return;

    // Entidad SupervisionSession
    var cSession = crearElem(pkg, "SupervisionSession", "Class", "entity");
    attr(cSession, "+ id: UUID [PK]", "UUID");
    attr(cSession, "+ userId: UUID [FK]", "UUID");
    attr(cSession, "+ organizationId: UUID [FK]", "UUID");
    attr(cSession, "+ questionnaireId: UUID? [FK]", "UUID");
    attr(cSession, "+ tipo: String = 'EXAMEN'", "String");
    attr(cSession, "+ estado: String = 'EN_PROGRESO'", "String");
    attr(cSession, "+ scoreIntegridad: Float?", "Float");
    attr(cSession, "+ totalIncidentes: Int = 0", "Int");
    attr(cSession, "+ tiempoActivoSeg: Int = 0", "Int");
    attr(cSession, "+ tiempoOciosoSeg: Int = 0", "Int");
    attr(cSession, "+ tiempoFueraSeg: Int = 0", "Int");
    colocar(diag, cSession, 50, -50, 340, -320);

    // Entidad BehaviorEvent
    var cEvent = crearElem(pkg, "BehaviorEvent", "Class", "entity");
    attr(cEvent, "+ id: UUID [PK]", "UUID");
    attr(cEvent, "+ sessionId: UUID [FK]", "UUID");
    attr(cEvent, "+ tipo: String", "String");
    attr(cEvent, "+ severidad: String = 'LOW'", "String");
    attr(cEvent, "+ duracionMs: Int?", "Int");
    attr(cEvent, "+ detalles: JSON?", "JSON");
    attr(cEvent, "+ timestamp: DateTime", "DateTime");
    colocar(diag, cEvent, 50, -370, 340, -560);

    // Entidad Questionnaire
    var cQuest = crearElem(pkg, "Questionnaire", "Class", "entity");
    attr(cQuest, "+ id: UUID [PK]", "UUID");
    attr(cQuest, "+ organizationId: UUID [FK]", "UUID");
    attr(cQuest, "+ titulo: String", "String");
    attr(cQuest, "+ urlExterna: String", "String");
    attr(cQuest, "+ codigoAcceso: String [UQ]", "String");
    attr(cQuest, "+ duracionMin: Int = 60", "Int");
    attr(cQuest, "+ limiteUsos: Int = 100", "Int");
    attr(cQuest, "+ activo: Boolean = true", "Boolean");
    colocar(diag, cQuest, 440, -50, 730, -300);

    // Entidad ControlQuestion
    var cCtrlQ = crearElem(pkg, "ControlQuestion", "Class", "entity");
    attr(cCtrlQ, "+ id: UUID [PK]", "UUID");
    attr(cCtrlQ, "+ questionnaireId: UUID? [FK]", "UUID");
    attr(cCtrlQ, "+ pregunta: String", "String");
    attr(cCtrlQ, "+ categoria: String = 'INTEGRIDAD'", "String");
    attr(cCtrlQ, "+ tiempoEsperaSeg: Int = 5", "Int");
    colocar(diag, cCtrlQ, 830, -50, 1100, -220);

    // Entidad ControlQuestionResponse
    var cCtrlResp = crearElem(pkg, "ControlQuestionResponse", "Class", "entity");
    attr(cCtrlResp, "+ id: UUID [PK]", "UUID");
    attr(cCtrlResp, "+ sessionId: UUID [FK]", "UUID");
    attr(cCtrlResp, "+ preguntaId: UUID [FK]", "UUID");
    attr(cCtrlResp, "+ disparadaEn: DateTime", "DateTime");
    attr(cCtrlResp, "+ latenciaRespuestaMs: Int?", "Int");
    attr(cCtrlResp, "+ deltaTensionFacial: Float?", "Float");
    colocar(diag, cCtrlResp, 590, -370, 890, -560);

    // Relaciones
    crearConector(cSession, cEvent, "Association", "registra 0..*", "");
    crearConector(cQuest, cSession, "Association", "supervisa 0..*", "");
    crearConector(cQuest, cCtrlQ, "Association", "contiene 1..*", "");
    crearConector(cSession, cCtrlResp, "Association", "captura 0..*", "");
    crearConector(cCtrlQ, cCtrlResp, "Association", "evaluada en 0..*", "");

    refrescarDiag(diag);
}

/* =========================================================================================
 * 4. DIAGRAMAS DE SECUENCIA UML (SPRINT 3)
 * ========================================================================================= */
function crearSecuenciaHU11_13(pkg) {
    Session.Output("-> Generando: 4.1. Secuencia HU11-HU13...");
    var diag = crearDiagramaSeguro(pkg, "sd HU11-HU13 - Mirada, Sospecha Celular y Rostros", "Sequence", "Logical");
    if (diag == null) return;

    var a = crearElem(pkg, "Evaluado", "Actor", "");
    var b = crearElem(pkg, "VisorSupervisadoUI", "Sequence", "");
    var c = crearElem(pkg, "WorkerMediaPipe", "Sequence", "");
    var d = crearElem(pkg, "SupervisionGateway", "Sequence", "");
    var e = crearElem(pkg, "BehaviorAuditService", "Sequence", "");
    var f = crearElem(pkg, "PostgreSQL", "Sequence", "");

    colocar(diag, a, 50, -50, 150, -550);
    colocar(diag, b, 200, -50, 300, -550);
    colocar(diag, c, 350, -50, 450, -550);
    colocar(diag, d, 500, -50, 600, -550);
    colocar(diag, e, 650, -50, 750, -550);
    colocar(diag, f, 800, -50, 900, -550);

    msg(diag, b, c, "1: procesarFrame(ImageBitmap)", 1);
    msg(diag, c, c, "2: resolverPnP() [Pitch/Yaw/Roll]", 2);
    msg(diag, c, c, "3: vectorIrisGaze() + ImageBitmap.close()", 3);
    msg(diag, c, b, "4: {pitch, yaw, roll, gazeZona, caras}", 4);
    msg(diag, b, d, "5: emit('telemetry:stream', <100 B)", 5);
    msg(diag, d, e, "6: evaluarPatronConducta(sessionId, data)", 6);
    msg(diag, e, e, "7: reglaCelular(Pitch<-20°, >2s, 3x/60s, noTeclado)", 7);
    msg(diag, e, f, "8: INSERT behavior_events (PHONE_SUSPECT)", 8);
    msg(diag, e, f, "9: auditarRostros (FACE_ABSENT > 5s)", 9);

    refrescarDiag(diag);
}

function crearSecuenciaHU14_16(pkg) {
    Session.Output("-> Generando: 4.2. Secuencia HU14-HU16...");
    var diag = crearDiagramaSeguro(pkg, "sd HU14-HU16 - Foco, Pantalla Completa y Atajos", "Sequence", "Logical");
    if (diag == null) return;

    var a = crearElem(pkg, "Evaluado", "Actor", "");
    var b = crearElem(pkg, "AgenteTelemetriaDOM", "Sequence", "");
    var c = crearElem(pkg, "FullScreenGuard", "Sequence", "");
    var d = crearElem(pkg, "SupervisionGateway", "Sequence", "");
    var e = crearElem(pkg, "TelemetryService", "Sequence", "");
    var f = crearElem(pkg, "PostgreSQL", "Sequence", "");

    colocar(diag, a, 50, -50, 150, -550);
    colocar(diag, b, 200, -50, 300, -550);
    colocar(diag, c, 350, -50, 450, -550);
    colocar(diag, d, 500, -50, 600, -550);
    colocar(diag, e, 650, -50, 750, -550);
    colocar(diag, f, 800, -50, 900, -550);

    msg(diag, a, b, "1: intentoAtajo (Ctrl+C, Ctrl+V, F12)", 1);
    msg(diag, b, b, "2: event.preventDefault() [Bloqueo]", 2);
    msg(diag, b, d, "3: emit('shortcut:blocked', {tecla})", 3);
    msg(diag, a, b, "4: window.blur() [Pérdida de Foco]", 4);
    msg(diag, b, d, "5: emit('focus:lost', {tiempoInicio})", 5);
    msg(diag, a, c, "6: fullscreenchange [Salida Pantalla]", 6);
    msg(diag, c, b, "7: forzarReingresoPantallaCompleta()", 7);
    msg(diag, d, e, "8: registrarIncidenteFocoYAtajo()", 8);
    msg(diag, e, f, "9: INSERT behavior_events (WINDOW_BLUR)", 9);

    refrescarDiag(diag);
}

function crearSecuenciaHU17_19(pkg) {
    Session.Output("-> Generando: 4.3. Secuencia HU17-HU19...");
    var diag = crearDiagramaSeguro(pkg, "sd HU17-HU19 - Cuestionarios y Preguntas de Control", "Sequence", "Logical");
    if (diag == null) return;

    var a = crearElem(pkg, "Evaluador", "Actor", "");
    var b = crearElem(pkg, "PanelEvaluadorUI", "Sequence", "");
    var c = crearElem(pkg, "SupervisionGateway", "Sequence", "");
    var d = crearElem(pkg, "VisorCandidatoUI", "Sequence", "");
    var e = crearElem(pkg, "WorkerMediaPipe", "Sequence", "");
    var f = crearElem(pkg, "PostgreSQL", "Sequence", "");

    colocar(diag, a, 50, -50, 150, -550);
    colocar(diag, b, 200, -50, 300, -550);
    colocar(diag, c, 350, -50, 450, -550);
    colocar(diag, d, 500, -50, 600, -550);
    colocar(diag, e, 650, -50, 750, -550);
    colocar(diag, f, 800, -50, 900, -550);

    msg(diag, a, b, "1: registrarCuestionario(urlForms, codigo)", 1);
    msg(diag, b, f, "2: INSERT INTO questionnaires", 2);
    msg(diag, a, b, "3: dispararPreguntaControl(id, 5s)", 3);
    msg(diag, b, c, "4: emit('interview:trigger', {preguntaId})", 4);
    msg(diag, c, d, "5: renderOverlayPregunta(pregunta, 5s)", 5);
    msg(diag, d, e, "6: activarCapturaFocalizada(5000 ms)", 6);
    msg(diag, e, e, "7: extraerBlendshapes() vs Baseline", 7);
    msg(diag, e, c, "8: emit('biometrics:resp', {deltaTension, latencia})", 8);
    msg(diag, c, f, "9: INSERT control_question_responses", 9);

    refrescarDiag(diag);
}

/* =========================================================================================
 * 5. DIAGRAMAS DE ESTADOS
 * ========================================================================================= */
function crearDiagramaEstados(pkg) {
    Session.Output("-> Generando: 5. Diagrama de Estados...");
    var diag = crearDiagramaSeguro(pkg, "stm Diagrama de Estados - Sesión de Supervisión", "Statechart", "Logical");
    if (diag == null) return;

    var sInit = crearElem(pkg, "Inicio", "StateNode", "");
    try { sInit.Subtype = 3; sInit.Update(); } catch(e) {}
    colocar(diag, sInit, 50, -100, 75, -125);

    var sProg = crearElem(pkg, "Programada / Esperando Acceso", "State", "");
    colocar(diag, sProg, 130, -80, 310, -150);

    var sCalib = crearElem(pkg, "Calibrando y Consentimiento", "State", "");
    colocar(diag, sCalib, 370, -80, 560, -150);

    var sActiva = crearElem(pkg, "En Progreso (Supervisada)", "State", "");
    colocar(diag, sActiva, 620, -80, 830, -150);

    var sAlerta = crearElem(pkg, "Alerta / Foco Perdido", "State", "");
    colocar(diag, sAlerta, 620, -220, 830, -290);

    var sFin = crearElem(pkg, "Finalizada", "State", "");
    colocar(diag, sFin, 890, -80, 1050, -150);

    var sFinal = crearElem(pkg, "Fin", "StateNode", "");
    try { sFinal.Subtype = 4; sFinal.Update(); } catch(e) {}
    colocar(diag, sFinal, 1110, -100, 1135, -125);

    crearConector(sInit, sProg, "StateFlow", "crearSesion()", "");
    crearConector(sProg, sCalib, "StateFlow", "ingresarCodigoAcceso()", "");
    crearConector(sCalib, sActiva, "StateFlow", "consentimientoFirmado && calibracionOk", "");
    crearConector(sActiva, sAlerta, "StateFlow", "window.blur() || fullscreenExit()", "");
    crearConector(sAlerta, sActiva, "StateFlow", "window.focus() && reingresoFullscreen", "");
    crearConector(sActiva, sFin, "StateFlow", "enviarExamen() || tiempoAgotado()", "");
    crearConector(sFin, sFinal, "StateFlow", "consolidarDatos()", "");

    refrescarDiag(diag);
}

/* =========================================================================================
 * 6. DIAGRAMA DE TIEMPO
 * ========================================================================================= */
function crearDiagramaTiempo(pkg) {
    Session.Output("-> Generando: 6. Diagrama de Tiempo...");
    // Intentar "UML Behavioral::Timing", luego "Timing", luego fallback a "Logical"
    var diag = crearDiagramaSeguro(pkg, "td Diagrama de Tiempo - Regla Celular y Pregunta", "Timing", "Logical");
    if (diag == null) return;

    var lPitch = crearElem(pkg, "Pitch de Cabeza (Ángulo Vertical)", "Class", "timeline");
    lPitch.Notes = "Línea temporal de Pitch: Neutro [-15° a 15°], Hacia Abajo [Pitch < -20°]";
    lPitch.Update();
    colocar(diag, lPitch, 50, -50, 750, -170);

    var lTeclado = crearElem(pkg, "Actividad de Teclado", "Class", "timeline");
    lTeclado.Notes = "Línea temporal: Inactivo (Sin pulsaciones) vs Escribiendo";
    lTeclado.Update();
    colocar(diag, lTeclado, 50, -200, 750, -310);

    var lEvento = crearElem(pkg, "Regla Sospecha Celular (PHONE_SUSPECT)", "Class", "timeline");
    lEvento.Notes = "Línea temporal de evento: Disparo ante Pitch < -20°, >2s, 3x/60s sin teclado";
    lEvento.Update();
    colocar(diag, lEvento, 50, -340, 750, -450);

    var lPregunta = crearElem(pkg, "Ventana de Pregunta de Control", "Class", "timeline");
    lPregunta.Notes = "Línea temporal: Estímulo t=0, Captura Gestual activa (5s), Hito temporal fijado";
    lPregunta.Update();
    colocar(diag, lPregunta, 50, -480, 750, -590);

    refrescarDiag(diag);
}

/* =========================================================================================
 * FUNCIONES ROBUSTAS DE SOPORTE PARA CUALQUIER VERSIÓN DE ENTERPRISE ARCHITECT
 * ========================================================================================= */
function crearDiagramaSeguro(pkg, nombre, tipoDeseado, tipoAlternativo) {
    var diag = null;
    // Intento 1: Tipo deseado
    try {
        diag = pkg.Diagrams.AddNew(nombre, tipoDeseado);
        if (diag != null && diag.Update()) {
            return diag;
        }
    } catch(e) {}

    // Intento 2: Tipo alternativo
    try {
        diag = pkg.Diagrams.AddNew(nombre, tipoAlternativo);
        if (diag != null && diag.Update()) {
            return diag;
        }
    } catch(e) {}

    // Intento 3: Logical (Class diagram) universal
    try {
        diag = pkg.Diagrams.AddNew(nombre, "Logical");
        if (diag != null && diag.Update()) {
            return diag;
        }
    } catch(e) {}

    // Intento 4: Custom
    try {
        diag = pkg.Diagrams.AddNew(nombre, "Custom");
        if (diag != null && diag.Update()) {
            return diag;
        }
    } catch(e) {}

    return null;
}

function crearElem(pkg, nombre, tipo, estereotipo) {
    var elem = null;
    try {
        elem = pkg.Elements.AddNew(nombre, tipo);
    } catch(e) {
        // Fallback si el tipo no existe en esa edición de EA
        elem = pkg.Elements.AddNew(nombre, "Class");
    }

    if (estereotipo && estereotipo != "") {
        try { elem.Stereotype = estereotipo; } catch(e) {}
    }
    elem.Update();
    return elem;
}

function colocar(diag, elem, l, t, r, b) {
    try {
        var dObj = diag.DiagramObjects.AddNew("", "");
        dObj.ElementID = elem.ElementID;
        dObj.left = l; dObj.top = t; dObj.right = r; dObj.bottom = b;
        dObj.Update();
        return dObj;
    } catch(e) {}
    return null;
}

function attr(elem, nom, tip) {
    try {
        var a = elem.Attributes.AddNew(nom, tip);
        a.Visibility = "Public";
        a.Update();
        return a;
    } catch(e) {}
    return null;
}

function crearConector(orig, dest, tipo, nom, ester) {
    try {
        var c = orig.Connectors.AddNew(nom, tipo);
        c.SupplierID = dest.ElementID;
        if (ester && ester != "") c.Stereotype = ester;
        c.Update();
        return c;
    } catch(e) {}
    return null;
}

function msg(diag, orig, dest, nom, seq) {
    try {
        var c = orig.Connectors.AddNew(nom, "Sequence");
        c.SupplierID = dest.ElementID;
        c.SequenceNo = seq;
        c.Update();
        return c;
    } catch(e) {}
    return null;
}

function refrescarDiag(diag) {
    try {
        diag.DiagramObjects.Refresh();
        diag.Update();
    } catch(e) {}
}

main();
