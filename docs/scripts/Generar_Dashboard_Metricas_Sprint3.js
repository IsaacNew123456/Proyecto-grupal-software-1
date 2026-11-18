//!INC Local Scripts.EAConstants-JScript
/*
 * =========================================================================================
 * PROYECTO: ErgoCheck & Monitor AI — INF-422 (UAGRM)
 * SPRINT 3: Dashboard de Métricas Ágiles (Burndown, BurnUp y Gráficas de Esfuerzo)
 * SCRIPT PARA ENTERPRISE ARCHITECT (JScript 100% Compatible)
 *
 * DESCRIPCIÓN:
 * Genera un diagrama de Dashboard/Métricas en Enterprise Architect con las fichas y tablas
 * de datos oficiales del Sprint 3:
 *   - 6.1. Burndown y BurnUp de Tareas (15 tareas, 15 días hábiles)
 *   - 7.1. Gráfica de Esfuerzo por Integrante (Número de tareas)
 *   - 7.2. Datos de Esfuerzo por Integrante (Horas invertidas - 108 horas totales)
 * =========================================================================================
 */

function main() {
    Session.Output("====================================================================");
    Session.Output("Generando Dashboard de Métricas Ágiles Sprint 3 en Enterprise Architect...");
    Session.Output("====================================================================");

    var selectedPkg = Repository.GetTreeSelectedPackage();
    if (selectedPkg == null) {
        Session.Prompt("Por favor seleccione un paquete en el Project Browser.", 1);
        return;
    }

    // 1. Crear diagrama de Dashboard / Métricas
    var diag = null;
    try {
        diag = selectedPkg.Diagrams.AddNew("Métricas Ágiles - Burndown y Esfuerzo Sprint 3", "Custom");
        diag.Update();
    } catch(e) {
        diag = selectedPkg.Diagrams.AddNew("Métricas Ágiles - Burndown y Esfuerzo Sprint 3", "Logical");
        diag.Update();
    }

    // 2. Ficha 6.1: Burndown de Tareas
    var elBurndown = crearElem(selectedPkg, "6.1. Burndown de Tareas (Ideal vs Real)", "Artifact", "chart");
    elBurndown.Notes = "BURNDOWN SPRINT 3 (15 tareas - 15 días hábiles):\n" +
                       "--------------------------------------------------\n" +
                       "Día 01 (14/10): Ideal: 15.0 | Real: 15.0\n" +
                       "Día 03 (16/10): Ideal: 12.8 | Real: 14.0 (SP3-1)\n" +
                       "Día 05 (20/10): Ideal: 10.7 | Real: 12.0 (SP3-5)\n" +
                       "Día 06 (21/10): Ideal:  9.6 | Real: 11.0 (SP3-2, SP3-10)\n" +
                       "Día 08 (23/10): Ideal:  7.5 | Real:  9.0 (SP3-4)\n" +
                       "Día 10 (27/10): Ideal:  5.3 | Real:  6.0 (SP3-6, SP3-11)\n" +
                       "Día 12 (29/10): Ideal:  3.2 | Real:  4.0 (SP3-8)\n" +
                       "Día 13 (30/10): Ideal:  2.1 | Real:  2.0 (SP3-12, SP3-9)\n" +
                       "Día 14 (02/11): Ideal:  1.0 | Real:  1.0 (SP3-13, SP3-14)\n" +
                       "Día 15 (03/11): Ideal:  0.0 | Real:  0.0 (SP3-15) [100% OK]";
    elBurndown.Update();
    colocar(diag, elBurndown, 50, -50, 480, -320);

    // 3. Ficha 6.2: BurnUp de Tareas
    var elBurnup = crearElem(selectedPkg, "6.2. BurnUp de Tareas (Completadas Acumuladas)", "Artifact", "chart");
    elBurnup.Notes = "BURNUP SPRINT 3 (Meta: 15 tareas):\n" +
                     "--------------------------------------------------\n" +
                     "Día 01 (14/10): Ideal:  0.0 | Real:  0 tareas\n" +
                     "Día 05 (20/10): Ideal:  4.3 | Real:  3 tareas\n" +
                     "Día 06 (21/10): Ideal:  5.4 | Real:  4 tareas\n" +
                     "Día 10 (27/10): Ideal:  9.7 | Real:  9 tareas\n" +
                     "Día 13 (30/10): Ideal: 12.9 | Real: 13 tareas\n" +
                     "Día 15 (03/11): Ideal: 15.0 | Real: 15 tareas (Meta cumplida)";
    elBurnup.Update();
    colocar(diag, elBurnup, 520, -50, 950, -320);

    // 4. Ficha 7.1: Gráfica de Esfuerzo (Número de Tareas por Integrante)
    var elTareas = crearElem(selectedPkg, "7.1. Gráfica de Esfuerzo (Número de Tareas por Integrante)", "Artifact", "chart");
    elTareas.Notes = "DISTRIBUCIÓN DE TAREAS POR INTEGRANTE (Total: 15 tareas):\n" +
                     "----------------------------------------------------------\n" +
                     "• Jairo Camacho:      2 tareas (SP3-1, SP3-2)\n" +
                     "• Marco Lopez:        4 tareas (SP3-5, SP3-6, SP3-12, SP3-13)\n" +
                     "• Juan M. Matienzo:   3 tareas (SP3-3, SP3-14, SP3-15)\n" +
                     "• Jerson Moreno:      3 tareas (SP3-7, SP3-8, SP3-9)\n" +
                     "• Isaac Orellana:     3 tareas (SP3-4, SP3-10, SP3-11)";
    elTareas.Update();
    colocar(diag, elTareas, 50, -360, 480, -600);

    // 5. Ficha 7.2: Datos de Esfuerzo (Horas Invertidas por Integrante)
    var elHoras = crearElem(selectedPkg, "7.2. Datos de Esfuerzo (Horas Invertidas por Integrante)", "Artifact", "chart");
    elHoras.Notes = "HORAS ESTIMADAS POR INTEGRANTE (Total: 108 horas):\n" +
                    "----------------------------------------------------------\n" +
                    "• Jairo Camacho:      20 horas (10h + 10h)\n" +
                    "• Marco Lopez:        24 horas (6h + 6h + 6h + 6h)\n" +
                    "• Juan M. Matienzo:   24 horas (8h + 10h + 6h)\n" +
                    "• Jerson Moreno:      20 horas (8h + 6h + 6h)\n" +
                    "• Isaac Orellana:     20 horas (6h + 8h + 6h)";
    elHoras.Update();
    colocar(diag, elHoras, 520, -360, 950, -600);

    diag.DiagramObjects.Refresh();
    diag.Update();
    selectedPkg.Diagrams.Refresh();
    Repository.RefreshModelView(selectedPkg.PackageID);

    Session.Output("====================================================================");
    Session.Output("¡Dashboard de Métricas Sprint 3 generado exitosamente!");
    Session.Output("====================================================================");
}

function crearElem(pkg, nombre, tipo, estereotipo) {
    var elem = null;
    try {
        elem = pkg.Elements.AddNew(nombre, tipo);
    } catch(e) {
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

main();
