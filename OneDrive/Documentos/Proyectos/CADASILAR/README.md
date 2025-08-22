# CADASILAr - Dashboard de Análisis del Registro Nacional de CADASIL Argentina

## Descripción General

CADASILAr es una aplicación web especializada para el análisis y visualización de datos del **Registro Nacional de CADASIL Argentina**, el primer esfuerzo sistemático para estudiar esta enfermedad en América Latina y el duodécimo registro de CADASIL a nivel mundial.

**CADASIL** (Arteriopatía Cerebral Autosómica Dominante con Infartos Subcorticales y Leucoencefalopatía) es la enfermedad hereditaria de pequeños vasos más frecuente, que produce accidentes cerebrovasculares de inicio temprano, deterioro cognitivo vascular, trastornos del estado de ánimo y convulsiones.

### Diseño del Estudio

CADASILAr es una **cohorte multicéntrica argentina** que incluye:
- **Fase transversal** (CADASILAr-C): Documentación de características basales
- **Fase longitudinal** (CADASILAr-Long): Seguimiento a 5 años para estudiar progresión
- **Biobancos integrados**: Preservación de muestras para investigación
- **Programa de donación cerebral**: Establecimiento de banco nacional de cerebros CADASIL

## Características Principales

### 🧬 **Especialización Médica**
- **Enfoque específico**: Dashboard diseñado exclusivamente para datos de CADASIL
- **Análisis genético**: Visualización de mutaciones NOTCH3 por exón
- **Evaluación cognitiva**: Seguimiento de puntuaciones MMSE/MoCA
- **Progresión clínica**: Análisis de síntomas y factores de riesgo vascular

### 📊 **Visualizaciones Avanzadas**
- **Múltiples pestañas especializadas**:
  - Resumen Ejecutivo
  - Demografía Clínica
  - Análisis Genético
  - Progresión Clínica
  - Distribución Nacional
- **Gráficos médicos**: BarChart, PieChart, LineChart, AreaChart con datos clínicos
- **Mapa interactivo**: Distribución geográfica de pacientes por provincia argentina

### 🔬 **Análisis Científico**
- **Datos demográficos**: Distribución por sexo, edad, dominancia manual
- **Confirmación diagnóstica**: Métodos genéticos, biopsia de piel, clínicos
- **Manifestaciones clínicas**: Eventos cerebrovasculares, migraña, deterioro cognitivo
- **Factores de riesgo**: Hipertensión, diabetes, dislipidemia, tabaquismo, obesidad

### 🎛️ **Funcionalidades Interactivas**
- **Filtros avanzados**: Por edad, sexo, síntoma inicial, método diagnóstico
- **Carga de datos**: Importación de archivos CSV con validación automática
- **Comparación temporal**: Análisis de datos históricos vs actuales
- **Vista experimental**: Mapa interactivo de Argentina con distribución provincial

## Arquitectura Técnica

### **Frontend Framework**
- **Next.js 14.2.16**: Framework React con App Router
- **TypeScript**: Tipado estático para mayor robustez
- **Tailwind CSS**: Styling utilitario con diseño responsivo

### **Componentes UI**
- **Radix UI**: Biblioteca de componentes accesibles y modernos
- **Recharts**: Biblioteca especializada para visualizaciones de datos
- **Lucide React**: Iconografía médica y científica

### **Gestión de Estado**
- **React Hooks**: useState, useEffect, useMemo para optimización
- **Client-side rendering**: Procesamiento en tiempo real de datos médicos

### **Herramientas de Desarrollo**
- **Papa Parse**: Procesamiento avanzado de archivos CSV médicos
- **Class Variance Authority**: Gestión de variantes de componentes
- **Next Themes**: Soporte para temas claro/oscuro

## Estructura del Proyecto

```
CADASILAR/
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes React
│   ├── ui/               # Componentes UI reutilizables
│   ├── cadasil-dashboard.tsx  # Dashboard principal
│   └── theme-provider.tsx    # Proveedor de temas
├── hooks/                # Custom hooks
├── lib/                  # Utilidades y configuración
├── public/              # Assets estáticos
├── styles/              # Estilos adicionales
└── configuración/       # Archivos de configuración
    ├── components.json  # Configuración de componentes
    ├── next.config.mjs  # Configuración de Next.js
    ├── package.json     # Dependencias del proyecto
    ├── tailwind.config.ts # Configuración de Tailwind
    └── tsconfig.json    # Configuración de TypeScript
```

## Funcionalidades Específicas de CADASIL

### **Datos Científicos Oficiales** (N=90 pacientes)
- **Demografía**: 50% mujeres, edad media 43.8 ± 11.9 años
- **Antecedentes familiares**: 91.6% positivos
- **Manifestaciones clínicas principales**:
  - Eventos cerebrovasculares: 72.9%
  - Migraña: 69%
  - Deterioro cognitivo: 56.7%
- **Comorbilidades frecuentes**:
  - Hipertensión arterial: 64%
  - Dislipidemia: 55%

### **Análisis Genético**
- **86 casos confirmados**: 63 por estudio genético, 20 por biopsia de piel
- **Mutaciones NOTCH3**: Todas alteran residuos de cisteína
- **Dominios EGF**: Principales sitios de mutación
- Distribución de métodos de confirmación diagnóstica

### **Evaluación Cognitiva**
- **MMSE**: Mediana 28 (RIC: 22-29) en 33 pacientes evaluados
- Seguimiento longitudinal de progresión cognitiva
- Análisis de deterioro vascular

### **Epidemiología Nacional**
- Distribución geográfica por provincias argentinas
- Análisis de factores socioeconómicos
- Integración con registros internacionales

## Tecnologías y Dependencias

### **Core**
- React 18 + Next.js 14
- TypeScript 5
- Tailwind CSS 3.4

### **Visualización**
- Recharts (gráficos médicos)
- Radix UI (componentes accesibles)

### **Procesamiento**
- Papa Parse (CSV médicos)
- Date-fns (manejo de fechas)
- Zod (validación de datos)

## Uso del Sistema

1. **Carga inicial**: Datos mock de demostración incluidos
2. **Importación**: Subir archivos CSV con datos de pacientes
3. **Filtrado**: Aplicar filtros por criterios clínicos
4. **Análisis**: Navegar por pestañas especializadas
5. **Visualización**: Interpretar gráficos y estadísticas médicas

## Contacto Científico

**Investigadora Principal**: Carolina Agata Ardohain Cristalli, MD  
**Institución**: FLENI, Buenos Aires, Argentina  
**Email**: caroardohain@gmail.com

**Instituciones Participantes**:
- FLENI (Buenos Aires)
- Hospital Británico
- Hospital Ramos Mejía  
- Hospital Posadas

---

*Dashboard desarrollado para el análisis científico y clínico del Registro Nacional de CADASIL Argentina*