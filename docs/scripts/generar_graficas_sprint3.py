import os
import matplotlib.pyplot as plt
import numpy as np

# Configurar estilo visual limpio y profesional (idéntico a las capturas)
plt.rcParams['font.sans-serif'] = 'Segoe UI', 'DejaVu Sans', 'Arial'
plt.rcParams['axes.edgecolor'] = '#444444'
plt.rcParams['axes.linewidth'] = 0.8

output_dir = r"c:\Users\HP\Documents\Proyecto Lopez\docs\scripts"
os.makedirs(output_dir, exist_ok=True)

# ==============================================================================
# 1. GRÁFICA DE BURNDOWN Y BURNUP DE TAREAS (SPRINT 3 - 15 TAREAS, 15 DÍAS HÁBILES)
# ==============================================================================
dias = np.arange(1, 16)  # Días 1 a 15 (3 semanas)
total_tareas = 15

# Línea Ideal Burndown (de 15 a 0 lineal)
ideal_burndown = np.linspace(15, 0, 15)

# Línea Real Burndown (15 tareas del Sprint 3 cerradas día a día)
# Semana 1 (Días 1-5): se cierran 4 tareas (quedan 11)
# Semana 2 (Días 6-10): se cierran 5 tareas (quedan 6)
# Semana 3 (Días 11-15): se cierran 6 tareas (quedan 0)
real_burndown = [15, 14.5, 14, 13, 12, 11, 10, 9, 8, 6, 5, 4, 2, 1, 0]

# Línea Ideal BurnUp (de 0 a 15 lineal)
ideal_burnup = np.linspace(0, 15, 15)

# Línea Real BurnUp (tareas completadas acumuladas)
real_burnup = [total_tareas - y for y in real_burndown]

# Crear figura combinada (Burndown arriba, BurnUp abajo)
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(9, 8), dpi=300)

# --- Subplot 1: Burndown ---
ax1.plot(dias, ideal_burndown, label='Ideal', linestyle='--', color='#E67E22', linewidth=1.5)
ax1.plot(dias, real_burndown, label='Real', marker='o', markersize=4.5, color='#5DADE2', linewidth=1.8)
ax1.set_ylabel('Tareas pendientes', fontsize=10, color='#2C3E50', labelpad=8)
ax1.set_xlabel('Días del Sprint (3 semanas)', fontsize=10, color='#2C3E50', labelpad=6)
ax1.set_xticks(dias)
ax1.set_yticks(np.arange(0, 17, 3))
ax1.set_xlim(0.5, 15.5)
ax1.set_ylim(-0.8, 16.5)
ax1.grid(True, linestyle=':', alpha=0.5, color='#BDC3C7')
ax1.spines['top'].set_visible(False)
ax1.spines['right'].set_visible(False)
ax1.legend(loc='upper right', frameon=True, facecolor='white', edgecolor='#D5DBDB', fontsize=8.5)

# --- Subplot 2: BurnUp ---
ax2.plot(dias, ideal_burnup, label='Ideal', linestyle='--', color='#E67E22', linewidth=1.5)
ax2.plot(dias, real_burnup, label='Real', marker='o', markersize=4.5, color='#5DADE2', linewidth=1.8)
ax2.set_ylabel('Tareas completadas', fontsize=10, color='#2C3E50', labelpad=8)
ax2.set_xlabel('Días del Sprint (3 semanas)', fontsize=10, color='#2C3E50', labelpad=6)
ax2.set_xticks(dias)
ax2.set_yticks(np.arange(0, 17, 3))
ax2.set_xlim(0.5, 15.5)
ax2.set_ylim(-0.8, 16.5)
ax2.grid(True, linestyle=':', alpha=0.5, color='#BDC3C7')
ax2.spines['top'].set_visible(False)
ax2.spines['right'].set_visible(False)
ax2.legend(loc='upper left', frameon=True, facecolor='white', edgecolor='#D5DBDB', fontsize=8.5)

plt.tight_layout(h_pad=3.0)
burndown_burnup_path = os.path.join(output_dir, "6.1_burndown_burnup_sprint3.png")
plt.savefig(burndown_burnup_path)
plt.close()
print("Guardado:", burndown_burnup_path)

# ==============================================================================
# INTEGRANTES OFICIALES Y DATOS DE ESFUERZO SPRINT 3
# ==============================================================================
# 1. Camacho Jimenez Jairo Lisandro: SP3-1 (10h), SP3-2 (10h) -> 2 tareas, 20 h
# 2. Lopez Velazquez Marco Alejandro: SP3-5 (6h), SP3-6 (6h), SP3-12 (6h), SP3-13 (6h) -> 4 tareas, 24 h
# 3. Matienzo Flores Juan Manuel: SP3-3 (8h), SP3-14 (10h), SP3-15 (6h) -> 3 tareas, 24 h
# 4. Moreno Gonzales Jerson Alexander: SP3-7 (8h), SP3-8 (6h), SP3-9 (6h) -> 3 tareas, 20 h
# 5. Orellana Escobar Isaac: SP3-4 (6h), SP3-10 (8h), SP3-11 (6h) -> 3 tareas, 20 h

integrantes = [
    "Jairo Camacho",
    "Marco Lopez",
    "Juan M. Matienzo",
    "Jerson Moreno",
    "Isaac Orellana"
]

tareas_por_integrante = [2, 4, 3, 3, 3]  # Total: 15 tareas
horas_por_integrante = [20, 24, 24, 20, 20]  # Total: 108 horas

# ==============================================================================
# 2. GRÁFICA 7.1: ESFUERZO POR NÚMERO DE TAREAS
# ==============================================================================
fig, ax = plt.subplots(figsize=(7.5, 4.5), dpi=300)
colores_tareas = ['#F1948A' for _ in integrantes]  # Color salmón / coral idéntico a la captura

barras = ax.bar(integrantes, tareas_por_integrante, color=colores_tareas, width=0.6, edgecolor='none')

ax.set_ylabel('Número de tareas', fontsize=10, color='#2C3E50', labelpad=8)
ax.set_ylim(0, 6)
ax.set_yticks(np.arange(0, 7, 2))
ax.grid(True, linestyle=':', alpha=0.5, color='#BDC3C7')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
plt.xticks(rotation=20, ha='right', fontsize=9.5, color='#2C3E50')

# Etiquetas sobre cada barra
for bar in barras:
    yval = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2.0, yval + 0.15, int(yval), 
            ha='center', va='bottom', fontsize=9, color='#333333', fontweight='normal')

plt.tight_layout()
grafica_tareas_path = os.path.join(output_dir, "7.1_grafica_esfuerzo_tareas.png")
plt.savefig(grafica_tareas_path)
plt.close()
print("Guardado:", grafica_tareas_path)

# ==============================================================================
# 3. GRÁFICA 7.2: DATOS DE ESFUERZO POR HORAS
# ==============================================================================
fig, ax = plt.subplots(figsize=(7.5, 4.5), dpi=300)
colores_horas = ['#7FB3D5' for _ in integrantes]  # Color celeste / azul suave idéntico a la captura

barras = ax.bar(integrantes, horas_por_integrante, color=colores_horas, width=0.6, edgecolor='none')

ax.set_ylabel('Horas', fontsize=10, color='#2C3E50', labelpad=8)
ax.set_ylim(0, 32)
ax.set_yticks(np.arange(0, 35, 10))
ax.grid(True, linestyle=':', alpha=0.5, color='#BDC3C7')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
plt.xticks(rotation=20, ha='right', fontsize=9.5, color='#2C3E50')

# Etiquetas sobre cada barra
for bar in barras:
    yval = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2.0, yval + 0.6, int(yval), 
            ha='center', va='bottom', fontsize=9, color='#333333', fontweight='normal')

plt.tight_layout()
grafica_horas_path = os.path.join(output_dir, "7.2_datos_esfuerzo_horas.png")
plt.savefig(grafica_horas_path)
plt.close()
print("Guardado:", grafica_horas_path)
