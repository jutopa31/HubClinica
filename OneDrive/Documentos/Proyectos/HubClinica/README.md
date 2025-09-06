# HUB CLÍNICA - Hospital Management System

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/Status-In%20Development-orange)](https://github.com/)

## 🏥 Overview

**HUB CLÍNICA** is a comprehensive hospital management system designed specifically for clinical medicine departments. It provides essential tools for medical staff scheduling, floor management, guard duty organization, and real-time alerts to ensure optimal hospital operations.

### ✨ Key Features

- **👥 Medical Staff Management**: Complete management of doctors, specialties, and ward assignments
- **🏢 Hospital Floor Management**: Real-time monitoring of medical staff distribution across hospital floors
- **📅 Guard Duty System**: Automated 5-group rotating guard system with Harry Potter house themes
- **⚠️ Smart Alerts**: Real-time alerts for understaffed floors and critical situations  
- **📊 Dashboard Analytics**: Comprehensive metrics and visual analytics for hospital operations
- **🎯 Responsive Design**: Mobile-first design optimized for tablets and mobile devices

## 🚀 Current Status: PROTOTYPE ⚙️

- **Version**: 1.0.0 (Prototype Phase)
- **Technology Stack**: React + TypeScript + Tailwind CSS + Lucide React
- **Development Stage**: Core functionality implemented, ready for testing and deployment

## 🛠️ Technical Architecture

### Frontend
- **React 18.2.0** with TypeScript for type-safe development
- **Tailwind CSS** for responsive and modern UI design
- **Lucide React** for professional medical iconography
- **Component-based architecture** with modular design

### Core Components
- `HubMedicina` - Main application component and routing
- `TablaSectoresMedicos` - Hospital floor management interface
- `CalendarioGuardias` - Guard duty scheduling system
- `MetricCard` - Dashboard metrics display
- `AlertCard` - Critical alert notifications

### Data Management
- **In-memory state management** with React hooks
- **Real-time calculations** for guard rotations and staffing
- **Dynamic alert system** based on staffing levels
- **Responsive data visualization** with Tailwind CSS

## 🏥 Medical Management Features

### Hospital Floor Management
- ✅ **Multi-floor monitoring** - 8 clinical medicine floors (3C, 3D, 4C, 4D, 5C, 6C, 7C, 7D)
- ✅ **Real-time staffing status** - Visual indicators for optimal, minimum, and critical staffing
- ✅ **Doctor assignment tracking** - Complete staff allocation per floor
- ✅ **Minimum staffing alerts** - Automatic warnings when floors are understaffed

### Guard Duty System
- ✅ **5-Group Rotation System** themed after Harry Potter houses:
  - 🦁 **Gryffindor** (Group 1) - Red theme
  - 🦡 **Hufflepuff** (Group 2) - Yellow theme  
  - 🦅 **Ravenclaw** (Group 3) - Blue theme
  - 🐍 **Slytherin** (Group 4) - Green theme
  - ⚡ **Dumbledore Army** (Group 5) - Purple theme
- ✅ **Automated scheduling** with 5-day rotation cycles
- ✅ **Calendar views** - Weekly and monthly guard schedules
- ✅ **Post-guard tracking** - Franco (rest day) management

### Staff Management  
- ✅ **Doctor profiles** with specialties and group assignments
- ✅ **Real-time availability** - Guard, franco, and available status
- ✅ **Group membership** tracking and visualization
- ✅ **Absence management** system

### Alert System
- ✅ **Critical alerts** - Floors below minimum staffing
- ✅ **Warning alerts** - Floors at minimum staffing  
- ✅ **Actionable suggestions** - Automatic recommendations for staffing issues
- ✅ **Visual indicators** - Color-coded alert levels

## 📊 Project Structure

```
hubclinica/
├── hub_medicina_prototipo.tsx    # Main application component
├── README.md                     # This documentation file
└── [Future Structure]
    ├── components/
    │   ├── dashboard/
    │   │   ├── MetricCard.tsx
    │   │   └── AlertCard.tsx
    │   ├── scheduling/
    │   │   ├── CalendarioGuardias.tsx
    │   │   └── GuardiaCalculator.ts
    │   ├── floors/
    │   │   └── TablaSectoresMedicos.tsx
    │   └── common/
    │       └── Navigation.tsx
    ├── types/
    │   ├── Medico.ts
    │   ├── PisoHospital.ts
    │   └── Alerta.ts
    ├── utils/
    │   └── guardiaCalculations.ts
    ├── data/
    │   ├── medicosData.ts
    │   ├── pisosData.ts
    │   └── gruposGuardia.ts
    └── hooks/
        ├── useGuardiaState.ts
        └── useAlerts.ts
```

## 🎨 UI/UX Features

### Dashboard Interface
- **Responsive sidebar navigation** with medical iconography
- **Real-time metrics cards** showing key performance indicators
- **Interactive date picker** for schedule management
- **Color-coded status indicators** for quick visual assessment

### Guard Management Interface
- **Toggle between weekly and monthly views**
- **Interactive calendar** with group color coding
- **Detailed group information cards** with member listings
- **Current guard group highlighting**

### Floor Management Interface  
- **Hospital floor grid layout** showing all clinical floors
- **Staff assignment matrix** with doctor details
- **Status color coding** (optimal/minimum/critical)
- **Real-time occupancy tracking**

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern web browser with ES6+ support

### Local Development Setup
```bash
# Create new React TypeScript project
npx create-react-app hubclinica --template typescript

# Navigate to project
cd hubclinica

# Install additional dependencies
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/react @types/react-dom

# Initialize Tailwind CSS
npx tailwindcss init -p

# Copy the prototype component
# Replace src/App.tsx with hub_medicina_prototipo.tsx content

# Start development server
npm start
```

### Available Scripts
```bash
npm start          # Development server
npm run build      # Production build  
npm test           # Run test suite
npm run lint       # Code linting
```

## 📈 Data Models

### Medical Staff (Medico)
```typescript
interface Medico {
  id: string;
  nombre: string;
  apellido: string;
  especialidad: string;
  grupoGuardia: 1 | 2 | 3 | 4 | 5;
  pisoAsignado: string;
  estado: 'disponible' | 'guardia' | 'franco' | 'ausente';
  ausencias: string[];
}
```

### Hospital Floor (PisoHospital)  
```typescript
interface PisoHospital {
  id: string;
  nombre: string;
  color: string;
  medicosRequeridos: number;
  minimoMedicos: number;
  medicosAsignados: Medico[];
}
```

### Alert System (Alerta)
```typescript
interface Alerta {
  id: string;
  tipo: 'critica' | 'advertencia' | 'info';
  piso: string;
  mensaje: string;
  medicosAfectados: number;
  sugerencias: string[];
}
```

### Guard Groups (GrupoGuardia)
```typescript
interface GrupoGuardia {
  id: number;
  nombre: string;
  casa: string;      // Harry Potter house emoji
  color: string;     // Dark theme color
  colorClaro: string; // Light theme color
}
```

## 🔄 Guard Rotation Logic

The system implements a 5-day rotation cycle with automatic calculations:

```typescript
class GuardiaCalculator {
  // Calculate which group is on guard for any given date
  static calcularGrupoGuardia(fecha: Date, fechaInicio: Date): number
  
  // Get all doctors currently on guard duty  
  static getMedicosEnGuardia(fecha: Date, medicos: Medico[]): Medico[]
  
  // Get doctors on post-guard rest (franco)
  static getMedicosEnFranco(fecha: Date, medicos: Medico[]): Medico[]
}
```

## 🚨 Alert System Logic

Smart alerts are generated based on staffing conditions:

- **🔴 Critical Alert**: Floor has fewer doctors than minimum required
- **🟡 Warning Alert**: Floor has exactly minimum required doctors  
- **🟢 Optimal Status**: Floor has adequate staffing levels

Each alert includes actionable suggestions for resolution.

## 🎯 Future Development Roadmap

### Phase 1: Database Integration
- [ ] Connect to PostgreSQL/MySQL database
- [ ] Implement data persistence
- [ ] Add user authentication system
- [ ] Create admin panel for data management

### Phase 2: Advanced Features  
- [ ] Shift change notifications
- [ ] Medical equipment tracking
- [ ] Patient census integration
- [ ] Reporting and analytics dashboard

### Phase 3: Mobile Application
- [ ] React Native mobile app
- [ ] Push notifications for critical alerts
- [ ] Offline functionality
- [ ] QR code scanning for quick access

### Phase 4: Integration Capabilities
- [ ] Hospital Information System (HIS) integration
- [ ] Electronic Health Record (EHR) compatibility  
- [ ] Pharmacy system integration
- [ ] Laboratory information system connection

## 👥 Sample Data Structure

The prototype includes realistic sample data:
- **25 doctors** across 5 guard groups
- **8 clinical medicine floors** with varying capacity requirements
- **Automated guard rotation** starting from January 1, 2025
- **Dynamic alert generation** based on real-time staffing calculations

## 🔐 Security Considerations

- Input validation for all user interactions
- Secure data handling for medical information
- Role-based access control (future implementation)
- HIPAA compliance considerations for patient data

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

## 🏥 Medical Disclaimer

This software is designed for administrative and scheduling purposes only. It does not provide medical advice, diagnosis, or treatment recommendations. Always follow institutional protocols and seek appropriate medical supervision for patient care decisions.

---

**Developed for**: Clinical Medicine Department Management  
**Purpose**: Hospital staff scheduling and floor management optimization  
**Status**: Prototype ready for implementation and testing  
**Last Updated**: January 6, 2025