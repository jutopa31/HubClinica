# 🏥 HubClinica - Sistema Completo de Gestión Hospitalaria

## 📋 Descripción
Sistema integral de gestión hospitalaria con funcionalidades avanzadas para la administración de personal médico, guardias, licencias y eventualidades.

## 🚀 URL de Despliegue
- **Producción**: [hub-clinica.vercel.app](https://hub-clinica.vercel.app)
- **Repositorio**: https://github.com/jutopa31/HubClinica

## ⭐ Funcionalidades Principales

### 📊 Dashboard Principal
- Métricas en tiempo real del personal médico
- Alertas críticas y advertencias
- Resumen de guardias activas
- Estado de sectores hospitalarios

### 🏢 Gestión de Sectores
- Distribución visual de médicos por piso
- Tabla interactiva con capacidad de edición
- Asignación y reasignación de personal
- Control de ocupación y mínimos requeridos

### 📅 Sistema de Guardias
- Calendario semanal y mensual
- Rotación automática por grupos (Casas de Harry Potter)
- Visualización de médicos en guardia/franco
- Planificación de turnos

### 👥 Gestión Avanzada de Médicos
- Base de datos completa de personal médico
- Estados: Disponible, Guardia, Franco, Vacaciones, Ausente
- Tarjetas interactivas con acciones rápidas
- Filtros por estado y especialidad

### 🎯 **Sistema de Eventualidades/Asistencia** (FUNCIONALIDAD PRINCIPAL)
#### 🏖️ Gestión de Vacaciones
- Solicitud y aprobación de vacaciones
- Seguimiento de períodos vacacionales
- Alertas de finalización próxima
- Historial completo

#### 🔄 Reasignaciones Temporales
- Cambios de sector temporales
- Motivos y períodos definidos
- Seguimiento de reasignaciones activas
- Retorno automático a sector original

#### 🏥 Ausencias Médicas/Licencias
- Gestión de licencias médicas
- Estados: Pendiente, Aprobado, Rechazado, Activo
- Sistema de aprobaciones por jefatura
- Registro de observaciones

#### 📋 Modal de Gestión
- Formularios específicos por tipo de eventualidad
- Validaciones automáticas
- Integración con calendario
- Notificaciones en tiempo real

### 🔍 Sistema de Búsqueda Avanzada
- Búsqueda de médicos por nombre, especialidad, sector
- Asignación inteligente de personal
- Filtros por disponibilidad
- Sugerencias automáticas

### 🚨 Sistema de Alertas Inteligentes
- **Alertas Críticas**: Sectores por debajo del mínimo
- **Advertencias**: Personal en mínimo requerido
- **Información**: Eventualidades pendientes
- **Notificaciones**: Vacaciones próximas a vencer

## 🛠️ Tecnologías
- **Frontend**: React + TypeScript + Vite
- **UI**: TailwindCSS + Lucide Icons
- **Estado**: React Hooks (useState, useMemo)
- **Despliegue**: Vercel

## 📁 Estructura del Proyecto
```
src/
├── components/
│   └── HubMedicina.tsx     # Componente principal (1000+ líneas)
├── App.tsx
└── main.tsx
```

## 🏗️ Componentes Principales
- `HubMedicina` - Componente principal del sistema
- `EventualidadModal` - Modal para gestión de eventualidades
- `DoctorCard` - Tarjeta de médico con acciones
- `DoctorSearchModal` - Búsqueda y asignación avanzada
- `TablaSectoresMedicos` - Tabla interactiva de sectores
- `CalendarioGuardias` - Sistema de guardias y turnos
- `MetricCard` - Métricas del dashboard
- `AlertCard` - Sistema de alertas

## 🎨 Temas y Personalización
- **Grupos de Guardia**: Temática Harry Potter (Gryffindor, Hufflepuff, etc.)
- **Colores por Sector**: Identificación visual por pisos
- **Estados Visuales**: Códigos de color para cada estado médico

## 🔧 Instalación y Desarrollo
```bash
# Clonar repositorio
git clone https://github.com/jutopa31/HubClinica.git

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 📈 Métricas del Proyecto
- **Líneas de código**: 1000+ líneas principales
- **Componentes**: 8 componentes principales
- **Funcionalidades**: 6 módulos principales
- **Tipos TypeScript**: 5 interfaces principales

## 🔄 Historial de Versiones
- **v3.0**: Restauración completa de funcionalidad de eventualidades (Septiembre 2025)
- **v2.0**: Migración a proyecto limpio
- **v1.0**: Sistema base de gestión hospitalaria

## 👨‍💻 Desarrollo
- **Desarrollador Principal**: jutopa31
- **Última actualización**: Septiembre 2025
- **Estado**: Producción activa

---
**Nota**: Este es el proyecto COMPLETO con todas las funcionalidades avanzadas. Para la versión simplificada, ver [hubclinica-clean](https://github.com/jutopa31/hubclinica-clean).