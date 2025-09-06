import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  AlertTriangle, 
  Clock, 
  Activity, 
  UserCheck, 
  UserX, 
  Shield, 
  Settings,
  BarChart3,
  Bell,
  Stethoscope,
  Building,
  ArrowRightLeft,
  Plane,
  Plus,
  Edit3,
  Save,
  X,
  MapPin,
  Users,
  Search,
  Check,
  UserPlus
} from 'lucide-react';

// Types
interface Medico {
  id: string;
  nombre: string;
  apellido: string;
  especialidad: string;
  grupoGuardia: 1 | 2 | 3 | 4 | 5;
  pisoAsignado: string;
  estado: 'disponible' | 'guardia' | 'franco' | 'ausente' | 'vacaciones';
  ausencias: string[];
  vacaciones: {
    fechaInicio: string;
    fechaFin: string;
    motivo: string;
    aprobado: boolean;
  }[];
  reasignaciones: {
    fechaInicio: string;
    fechaFin: string;
    pisoAnterior: string;
    pisoNuevo: string;
    motivo: string;
  }[];
}

interface Eventualidad {
  id: string;
  tipo: 'vacaciones' | 'reasignacion' | 'ausencia_medica' | 'licencia';
  medicoId: string;
  fechaInicio: string;
  fechaFin: string;
  motivo: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'activo';
  detalles?: {
    pisoOrigen?: string;
    pisoDestino?: string;
    reemplazo?: string;
    observaciones?: string;
  };
}

interface PisoHospital {
  id: string;
  nombre: string;
  color: string;
  medicosRequeridos: number;
  minimoMedicos: number;
  medicosAsignados: Medico[];
}

interface Alerta {
  id: string;
  tipo: 'critica' | 'advertencia' | 'info';
  piso: string;
  mensaje: string;
  medicosAfectados: number;
  sugerencias: string[];
}

interface GrupoGuardia {
  id: number;
  nombre: string;
  casa: string;
  color: string;
  colorClaro: string;
}

// Interfaces para sistema editable (preparadas para Supabase)
interface AsignacionMedico {
  id: string;
  medicoId: string;
  sectorId: string;
  fechaInicio: string;
  fechaFin?: string;
  estemporal: boolean;
  motivo?: string;
  posicion: number; // posición en el sector
}

interface EditableSlot {
  sectorId: string;
  posicion: number;
  medicoAsignado?: Medico;
}

// Sample Data con nombres de Harry Potter
const gruposGuardia: GrupoGuardia[] = [
  { id: 1, nombre: 'Gryffindor', casa: '🦁', color: 'bg-red-600', colorClaro: 'bg-red-100 text-red-800' },
  { id: 2, nombre: 'Hufflepuff', casa: '🦡', color: 'bg-yellow-600', colorClaro: 'bg-yellow-100 text-yellow-800' },
  { id: 3, nombre: 'Ravenclaw', casa: '🦅', color: 'bg-blue-600', colorClaro: 'bg-blue-100 text-blue-800' },
  { id: 4, nombre: 'Slytherin', casa: '🐍', color: 'bg-green-600', colorClaro: 'bg-green-100 text-green-800' },
  { id: 5, nombre: 'Dumbledore Army', casa: '⚡', color: 'bg-purple-600', colorClaro: 'bg-purple-100 text-purple-800' },
];

const medicosData: Medico[] = [
  // Piso 3C
  { id: '1', nombre: 'Dr. Carlos', apellido: 'González', especialidad: 'Clínica Médica', grupoGuardia: 1, pisoAsignado: '3C', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  { id: '2', nombre: 'Dra. María', apellido: 'López', especialidad: 'Clínica Médica', grupoGuardia: 2, pisoAsignado: '3C', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  { id: '3', nombre: 'Dr. Luis', apellido: 'Martínez', especialidad: 'Clínica Médica', grupoGuardia: 3, pisoAsignado: '3C', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  { id: '4', nombre: 'Dra. Ana', apellido: 'Rodríguez', especialidad: 'Clínica Médica', grupoGuardia: 4, pisoAsignado: '3C', estado: 'vacaciones', ausencias: [], vacaciones: [{fechaInicio: '2025-01-08', fechaFin: '2025-01-15', motivo: 'Vacaciones anuales', aprobado: true}], reasignaciones: [] },
  
  // Piso 3D
  { id: '5', nombre: 'Dr. Pedro', apellido: 'Silva', especialidad: 'Clínica Médica', grupoGuardia: 1, pisoAsignado: '3D', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  { id: '6', nombre: 'Dra. Laura', apellido: 'García', especialidad: 'Clínica Médica', grupoGuardia: 2, pisoAsignado: '4C', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [{fechaInicio: '2025-01-06', fechaFin: '2025-01-20', pisoAnterior: '3D', pisoNuevo: '4C', motivo: 'Refuerzo por vacaciones'}] },
  { id: '7', nombre: 'Dr. Miguel', apellido: 'Fernández', especialidad: 'Clínica Médica', grupoGuardia: 3, pisoAsignado: '3D', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  
  // Piso 4C
  { id: '8', nombre: 'Dra. Carmen', apellido: 'Morales', especialidad: 'Clínica Médica', grupoGuardia: 1, pisoAsignado: '4C', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  { id: '9', nombre: 'Dr. Javier', apellido: 'Ruiz', especialidad: 'Clínica Médica', grupoGuardia: 2, pisoAsignado: '4C', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  { id: '10', nombre: 'Dra. Isabel', apellido: 'Jiménez', especialidad: 'Clínica Médica', grupoGuardia: 4, pisoAsignado: '4C', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  { id: '11', nombre: 'Dr. Roberto', apellido: 'Vázquez', especialidad: 'Clínica Médica', grupoGuardia: 5, pisoAsignado: '4C', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  
  // Piso 4D
  { id: '12', nombre: 'Dra. Elena', apellido: 'Castro', especialidad: 'Clínica Médica', grupoGuardia: 1, pisoAsignado: '4D', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  { id: '13', nombre: 'Dr. Francisco', apellido: 'Herrera', especialidad: 'Clínica Médica', grupoGuardia: 3, pisoAsignado: '4D', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  { id: '14', nombre: 'Dra. Lucía', apellido: 'Mendoza', especialidad: 'Clínica Médica', grupoGuardia: 4, pisoAsignado: '4D', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  
  // Piso 5C
  { id: '15', nombre: 'Dr. Antonio', apellido: 'Guerrero', especialidad: 'Clínica Médica', grupoGuardia: 2, pisoAsignado: '5C', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  { id: '16', nombre: 'Dra. Teresa', apellido: 'Romero', especialidad: 'Clínica Médica', grupoGuardia: 3, pisoAsignado: '5C', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  { id: '17', nombre: 'Dr. Sergio', apellido: 'Blanco', especialidad: 'Clínica Médica', grupoGuardia: 5, pisoAsignado: '5C', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  
  // Piso 6C
  { id: '18', nombre: 'Dra. Patricia', apellido: 'Navarro', especialidad: 'Clínica Médica', grupoGuardia: 1, pisoAsignado: '6C', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  { id: '19', nombre: 'Dr. Raúl', apellido: 'Ortega', especialidad: 'Clínica Médica', grupoGuardia: 4, pisoAsignado: '6C', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  { id: '20', nombre: 'Dra. Cristina', apellido: 'Delgado', especialidad: 'Clínica Médica', grupoGuardia: 5, pisoAsignado: '6C', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  
  // Piso 7C
  { id: '21', nombre: 'Dr. Álvaro', apellido: 'Santos', especialidad: 'Clínica Médica', grupoGuardia: 2, pisoAsignado: '7C', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  { id: '22', nombre: 'Dra. Mónica', apellido: 'Ramos', especialidad: 'Clínica Médica', grupoGuardia: 3, pisoAsignado: '7C', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  { id: '23', nombre: 'Dr. Diego', apellido: 'Vargas', especialidad: 'Clínica Médica', grupoGuardia: 1, pisoAsignado: '7C', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  
  // Piso 7D
  { id: '24', nombre: 'Dra. Beatriz', apellido: 'Molina', especialidad: 'Clínica Médica', grupoGuardia: 4, pisoAsignado: '7D', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
  { id: '25', nombre: 'Dr. Emilio', apellido: 'Prieto', especialidad: 'Clínica Médica', grupoGuardia: 5, pisoAsignado: '7D', estado: 'disponible', ausencias: [], vacaciones: [], reasignaciones: [] },
];

// Sample Eventualidades Data
const eventualidadesData: Eventualidad[] = [
  {
    id: '1',
    tipo: 'vacaciones',
    medicoId: '4',
    fechaInicio: '2025-01-08',
    fechaFin: '2025-01-15',
    motivo: 'Vacaciones anuales programadas',
    estado: 'activo',
    detalles: {
      observaciones: 'Cubierto por reasignación temporal'
    }
  },
  {
    id: '2',
    tipo: 'reasignacion',
    medicoId: '6',
    fechaInicio: '2025-01-06',
    fechaFin: '2025-01-20',
    motivo: 'Refuerzo por vacaciones de colega',
    estado: 'activo',
    detalles: {
      pisoOrigen: '3D',
      pisoDestino: '4C',
      observaciones: 'Temporal por vacaciones Dra. Rodríguez'
    }
  },
  {
    id: '3',
    tipo: 'ausencia_medica',
    medicoId: '12',
    fechaInicio: '2025-01-10',
    fechaFin: '2025-01-12',
    motivo: 'Licencia médica',
    estado: 'pendiente',
    detalles: {
      observaciones: 'Pendiente de aprobación jefatura'
    }
  }
];

const pisosData: PisoHospital[] = [
  { id: '3C', nombre: 'Piso 3C - Clínica Médica', color: 'bg-red-500', medicosRequeridos: 4, minimoMedicos: 3, medicosAsignados: [] },
  { id: '3D', nombre: 'Piso 3D - Clínica Médica', color: 'bg-cyan-500', medicosRequeridos: 3, minimoMedicos: 2, medicosAsignados: [] },
  { id: '4C', nombre: 'Piso 4C - Clínica Médica', color: 'bg-purple-500', medicosRequeridos: 4, minimoMedicos: 3, medicosAsignados: [] },
  { id: '4D', nombre: 'Piso 4D - Clínica Médica', color: 'bg-orange-500', medicosRequeridos: 3, minimoMedicos: 2, medicosAsignados: [] },
  { id: '5C', nombre: 'Piso 5C - Clínica Médica', color: 'bg-blue-500', medicosRequeridos: 3, minimoMedicos: 2, medicosAsignados: [] },
  { id: '6C', nombre: 'Piso 6C - Clínica Médica', color: 'bg-green-500', medicosRequeridos: 3, minimoMedicos: 2, medicosAsignados: [] },
  { id: '7C', nombre: 'Piso 7C - Clínica Médica', color: 'bg-amber-500', medicosRequeridos: 3, minimoMedicos: 2, medicosAsignados: [] },
  { id: '7D', nombre: 'Piso 7D - Clínica Médica', color: 'bg-teal-500', medicosRequeridos: 2, minimoMedicos: 2, medicosAsignados: [] },
];

// Utility functions
class GuardiaCalculator {
  static calcularGrupoGuardia(fecha: Date, fechaInicio: Date = new Date('2025-01-01')): number {
    const diasTranscurridos = Math.floor((fecha.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
    return (Math.floor(diasTranscurridos / 5) % 5) + 1;
  }
  
  static getMedicosEnGuardia(fecha: Date, medicos: Medico[]): Medico[] {
    const grupoActivo = this.calcularGrupoGuardia(fecha);
    return medicos.filter(m => m.grupoGuardia === grupoActivo);
  }
  
  static getMedicosEnFranco(fecha: Date, medicos: Medico[]): Medico[] {
    const fechaAnterior = new Date(fecha);
    fechaAnterior.setDate(fechaAnterior.getDate() - 1);
    return this.getMedicosEnGuardia(fechaAnterior, medicos);
  }

  static getGrupoInfo(grupoId: number): GrupoGuardia {
    return gruposGuardia.find(g => g.id === grupoId) || gruposGuardia[0];
  }
}

// Eventualidad Manager Component
const EventualidadModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  medico?: Medico;
  tipo: 'vacaciones' | 'reasignacion' | 'ausencia_medica';
  onSubmit: (eventualidad: Omit<Eventualidad, 'id'>) => void;
  pisos: PisoHospital[];
}> = ({ isOpen, onClose, medico, tipo, onSubmit, pisos }) => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [motivo, setMotivo] = useState('');
  const [pisoDestino, setPisoDestino] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medico || !fechaInicio || !fechaFin || !motivo) return;

    const nuevaEventualidad: Omit<Eventualidad, 'id'> = {
      tipo,
      medicoId: medico.id,
      fechaInicio,
      fechaFin,
      motivo,
      estado: 'pendiente',
      detalles: {
        ...(tipo === 'reasignacion' && {
          pisoOrigen: medico.pisoAsignado,
          pisoDestino
        }),
        observaciones
      }
    };

    onSubmit(nuevaEventualidad);
    onClose();
    
    // Reset form
    setFechaInicio('');
    setFechaFin('');
    setMotivo('');
    setPisoDestino('');
    setObservaciones('');
  };

  if (!isOpen || !medico) return null;

  const getTipoTitle = () => {
    switch (tipo) {
      case 'vacaciones': return 'Solicitar Vacaciones';
      case 'reasignacion': return 'Reasignar Médico';
      case 'ausencia_medica': return 'Licencia Médica';
      default: return 'Nueva Eventualidad';
    }
  };

  const getTipoIcon = () => {
    switch (tipo) {
      case 'vacaciones': return <Plane className="h-5 w-5" />;
      case 'reasignacion': return <ArrowRightLeft className="h-5 w-5" />;
      case 'ausencia_medica': return <Shield className="h-5 w-5" />;
      default: return <Plus className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            {getTipoIcon()}
            <span className="ml-2">{getTipoTitle()}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-gray-900">
              {medico.nombre} {medico.apellido}
            </div>
            <div className="text-xs text-gray-600">
              {medico.especialidad} - Piso {medico.pisoAsignado}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {tipo === 'reasignacion' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Piso Destino
              </label>
              <select
                value={pisoDestino}
                onChange={(e) => setPisoDestino(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={tipo === 'reasignacion'}
              >
                <option value="">Seleccionar piso...</option>
                {pisos.filter(p => p.id !== medico.pisoAsignado).map(piso => (
                  <option key={piso.id} value={piso.id}>
                    {piso.id} - {piso.nombre.replace('Piso ' + piso.id + ' - ', '')}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo
            </label>
            <input
              type="text"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Motivo de ${tipo === 'vacaciones' ? 'las vacaciones' : tipo === 'reasignacion' ? 'la reasignación' : 'la ausencia'}`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Observaciones adicionales..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Doctor Card with Actions
const DoctorCard: React.FC<{
  medico: Medico;
  onVacaciones: (medico: Medico) => void;
  onReasignar: (medico: Medico) => void;
  onAusencia: (medico: Medico) => void;
  onEditDoctor?: (medico: Medico) => void;
  showActions?: boolean;
  showEditButton?: boolean;
}> = ({ medico, onVacaciones, onReasignar, onAusencia, onEditDoctor, showActions = true, showEditButton = false }) => {
  const getEstadoColor = () => {
    switch (medico.estado) {
      case 'disponible': return 'bg-green-100 text-green-800';
      case 'guardia': return 'bg-blue-100 text-blue-800';
      case 'franco': return 'bg-gray-100 text-gray-800';
      case 'vacaciones': return 'bg-purple-100 text-purple-800';
      case 'ausente': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoText = () => {
    switch (medico.estado) {
      case 'disponible': return 'Disponible';
      case 'guardia': return 'En Guardia';
      case 'franco': return 'Franco';
      case 'vacaciones': return 'Vacaciones';
      case 'ausente': return 'Ausente';
      default: return 'N/A';
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900">
            {medico.nombre} {medico.apellido}
          </h4>
          <p className="text-sm text-gray-600">{medico.especialidad}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor()}`}>
          {getEstadoText()}
        </span>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          <span>Piso {medico.pisoAsignado}</span>
        </div>
        <div className={`flex items-center px-2 py-1 rounded-full text-xs ${
          GuardiaCalculator.getGrupoInfo(medico.grupoGuardia).colorClaro
        }`}>
          <span className="mr-1">
            {GuardiaCalculator.getGrupoInfo(medico.grupoGuardia).casa}
          </span>
          {GuardiaCalculator.getGrupoInfo(medico.grupoGuardia).nombre}
        </div>
      </div>

      {/* Mostrar reasignaciones activas */}
      {medico.reasignaciones.length > 0 && (
        <div className="text-xs bg-blue-50 border border-blue-200 rounded p-2">
          <strong>Reasignación:</strong> {medico.reasignaciones[0].pisoAnterior} → {medico.reasignaciones[0].pisoNuevo}
          <br />
          <span className="text-gray-600">{medico.reasignaciones[0].motivo}</span>
        </div>
      )}

      {/* Mostrar vacaciones activas */}
      {medico.vacaciones.length > 0 && medico.estado === 'vacaciones' && (
        <div className="text-xs bg-purple-50 border border-purple-200 rounded p-2">
          <strong>Vacaciones:</strong> {medico.vacaciones[0].fechaInicio} - {medico.vacaciones[0].fechaFin}
          <br />
          <span className="text-gray-600">{medico.vacaciones[0].motivo}</span>
        </div>
      )}

      {/* Action buttons */}
      {showActions && medico.estado === 'disponible' && (
        <div className="space-y-2 pt-2 border-t">
          <div className="flex gap-2">
            <button
              onClick={() => onVacaciones(medico)}
              className="flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
            >
              <Plane className="h-3 w-3 mr-1" />
              Vacaciones
            </button>
            <button
              onClick={() => onReasignar(medico)}
              className="flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              <ArrowRightLeft className="h-3 w-3 mr-1" />
              Reasignar
            </button>
            <button
              onClick={() => onAusencia(medico)}
              className="flex items-center px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              <Shield className="h-3 w-3 mr-1" />
              Ausencia
            </button>
          </div>
          
          {/* Edit button */}
          {showEditButton && onEditDoctor && (
            <button
              onClick={() => onEditDoctor(medico)}
              className="w-full flex items-center justify-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Reasignar Sector
            </button>
          )}
        </div>
      )}

      {/* Edit button for non-available doctors */}
      {showEditButton && onEditDoctor && medico.estado !== 'disponible' && (
        <div className="pt-2 border-t">
          <button
            onClick={() => onEditDoctor(medico)}
            className="w-full flex items-center justify-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Cambiar Sector
          </button>
        </div>
      )}
    </div>
  );
};

// Doctor Search Modal Component
const DoctorSearchModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectDoctor: (medico: Medico) => void;
  currentDoctor?: Medico;
  allDoctors: Medico[];
  excludeAssigned?: boolean;
  sector?: string;
  position?: number;
}> = ({ isOpen, onClose, onSelectDoctor, currentDoctor, allDoctors, excludeAssigned = false, sector, position }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState<Medico[]>(allDoctors);

  // Real-time search
  React.useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDoctors(allDoctors);
      return;
    }

    const filtered = allDoctors.filter(medico => {
      const fullName = `${medico.nombre} ${medico.apellido}`.toLowerCase();
      const search = searchTerm.toLowerCase();
      
      return fullName.includes(search) || 
             medico.especialidad.toLowerCase().includes(search) ||
             medico.pisoAsignado.toLowerCase().includes(search);
    });

    // Exclude already assigned doctors if requested
    if (excludeAssigned) {
      const available = filtered.filter(m => 
        m.estado === 'disponible' && 
        (currentDoctor?.id === m.id || m.pisoAsignado === sector || !m.pisoAsignado)
      );
      setFilteredDoctors(available);
    } else {
      setFilteredDoctors(filtered);
    }
  }, [searchTerm, allDoctors, excludeAssigned, currentDoctor, sector]);

  const handleSelect = (medico: Medico) => {
    onSelectDoctor(medico);
    onClose();
    setSearchTerm('');
  };

  const handleRemoveDoctor = () => {
    // Send a null doctor to indicate removal
    onSelectDoctor(null as any);
    onClose();
    setSearchTerm('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Buscar y Asignar Médico
            {sector && position !== undefined && (
              <span className="ml-2 text-sm text-gray-600">
                - {sector} Posición {position + 1}
              </span>
            )}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Current Assignment */}
        {currentDoctor && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Actualmente asignado: {currentDoctor.nombre} {currentDoctor.apellido}
                </div>
                <div className="text-xs text-gray-600">
                  {currentDoctor.especialidad} - {currentDoctor.pisoAsignado}
                </div>
              </div>
              <button
                onClick={handleRemoveDoctor}
                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                Quitar Asignación
              </button>
            </div>
          </div>
        )}

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, apellido, especialidad o sector..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No se encontraron médicos</p>
                {searchTerm && (
                  <p className="text-sm">Intenta con otro término de búsqueda</p>
                )}
              </div>
            ) : (
              filteredDoctors.map(medico => {
                const isCurrentlyAssigned = currentDoctor?.id === medico.id;
                const canAssign = medico.estado === 'disponible' || isCurrentlyAssigned;
                
                return (
                  <div 
                    key={medico.id} 
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      canAssign 
                        ? 'hover:bg-blue-50 hover:border-blue-300 border-gray-200' 
                        : 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                    } ${isCurrentlyAssigned ? 'bg-blue-50 border-blue-300' : ''}`}
                    onClick={() => canAssign && handleSelect(medico)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <div className="font-medium text-gray-900">
                              {medico.nombre} {medico.apellido}
                              {isCurrentlyAssigned && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  Actual
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {medico.especialidad}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>Sector {medico.pisoAsignado}</span>
                          </div>
                          <div className={`flex items-center px-2 py-1 rounded-full text-xs ${
                            GuardiaCalculator.getGrupoInfo(medico.grupoGuardia).colorClaro
                          }`}>
                            <span className="mr-1">
                              {GuardiaCalculator.getGrupoInfo(medico.grupoGuardia).casa}
                            </span>
                            {GuardiaCalculator.getGrupoInfo(medico.grupoGuardia).nombre}
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            medico.estado === 'disponible' ? 'bg-green-100 text-green-800' :
                            medico.estado === 'guardia' ? 'bg-blue-100 text-blue-800' :
                            medico.estado === 'vacaciones' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {medico.estado === 'disponible' ? 'Disponible' :
                             medico.estado === 'guardia' ? 'Guardia' :
                             medico.estado === 'vacaciones' ? 'Vacaciones' :
                             medico.estado}
                          </div>
                        </div>
                      </div>
                      {canAssign && (
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              {filteredDoctors.length} médico{filteredDoctors.length !== 1 ? 's' : ''} encontrado{filteredDoctors.length !== 1 ? 's' : ''}
            </span>
            <span className="text-xs">
              Tip: Usa el buscador para filtrar por nombre, especialidad o sector
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Components
const TablaSectoresMedicos: React.FC<{
  pisos: PisoHospital[];
  medicosDisponibles: Medico[];
  fecha: Date;
  onEditSlot?: (sector: string, position: number, currentDoctor?: Medico) => void;
  editable?: boolean;
}> = ({ pisos, medicosDisponibles, fecha, onEditSlot, editable = false }) => {
  
  const getStatusColor = (cantidadMedicos: number, minimo: number) => {
    if (cantidadMedicos < minimo) return 'bg-red-100 border-red-300';
    if (cantidadMedicos === minimo) return 'bg-yellow-100 border-yellow-300';
    return 'bg-green-100 border-green-300';
  };

  // Obtener el máximo número de médicos en cualquier piso para determinar las filas
  const maxMedicos = Math.max(...pisos.map(piso => 
    medicosDisponibles.filter(m => m.pisoAsignado === piso.id).length
  ), 8); // Mínimo 8 filas para mostrar

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Building className="h-5 w-5 mr-2" />
          Distribución de Sectores - Clínica Médica - {fecha.toLocaleDateString('es-ES')}
          {editable && (
            <span className="ml-3 text-sm font-normal text-blue-600 bg-blue-100 px-2 py-1 rounded">
              Modo Edición
            </span>
          )}
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Encabezados de Pisos */}
          <thead>
            <tr>
              <td className="border border-gray-300 p-2 bg-gray-100 font-medium text-gray-600 text-center">
                Médicos
              </td>
              {pisos.map((piso) => {
                const medicosDelPiso = medicosDisponibles.filter(m => m.pisoAsignado === piso.id);
                const cantidadMedicos = medicosDelPiso.length;
                
                return (
                  <th key={piso.id} className={`border border-gray-300 p-3 text-center min-w-32 ${getStatusColor(cantidadMedicos, piso.minimoMedicos)}`}>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${piso.color}`}></div>
                        <span className="font-bold text-gray-900">{piso.id}</span>
                      </div>
                      <div className="text-xs text-gray-600">Clínica Médica</div>
                      <div className="text-sm font-semibold">
                        {cantidadMedicos}/{piso.medicosRequeridos}
                        <span className="text-xs text-gray-500 block">
                          (mín: {piso.minimoMedicos})
                        </span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cantidadMedicos < piso.minimoMedicos ? 'bg-red-200 text-red-800' :
                        cantidadMedicos === piso.minimoMedicos ? 'bg-yellow-200 text-yellow-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {cantidadMedicos < piso.minimoMedicos ? 'CRÍTICO' :
                         cantidadMedicos === piso.minimoMedicos ? 'MÍNIMO' : 'ÓPTIMO'}
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          
          {/* Filas de Médicos */}
          <tbody>
            {Array.from({ length: maxMedicos }, (_, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2 bg-gray-50 text-center font-medium text-gray-600">
                  {index + 1}
                </td>
                {pisos.map((piso) => {
                  const medicosDelPiso = medicosDisponibles.filter(m => m.pisoAsignado === piso.id);
                  const medico = medicosDelPiso[index];
                  
                  return (
                    <td key={piso.id} className="border border-gray-300 p-2 text-center h-20 align-middle relative group">
                      {medico ? (
                        <div className="space-y-1 relative">
                          <div className="text-sm font-medium text-gray-900">
                            {medico.nombre} {medico.apellido}
                          </div>
                          <div className="text-xs text-gray-600">
                            {medico.especialidad}
                          </div>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            GuardiaCalculator.getGrupoInfo(medico.grupoGuardia).colorClaro
                          }`}>
                            <span className="mr-1">
                              {GuardiaCalculator.getGrupoInfo(medico.grupoGuardia).casa}
                            </span>
                            {GuardiaCalculator.getGrupoInfo(medico.grupoGuardia).nombre}
                          </div>
                          
                          {/* Edit button - shown on hover */}
                          {editable && onEditSlot && (
                            <button
                              onClick={() => onEditSlot(piso.id, index, medico)}
                              className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white rounded-full p-1 text-xs hover:bg-blue-700"
                              title="Cambiar médico"
                            >
                              <Edit3 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="relative">
                          {editable && onEditSlot ? (
                            <button
                              onClick={() => onEditSlot(piso.id, index)}
                              className="w-full h-full flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded group"
                              title="Asignar médico"
                            >
                              <div className="flex flex-col items-center space-y-1">
                                <UserPlus className="h-4 w-4" />
                                <span className="text-xs">Asignar</span>
                              </div>
                            </button>
                          ) : (
                            <div className="text-gray-300 text-xs">—</div>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CalendarioGuardias: React.FC<{ 
  medicos: Medico[]; 
  fechaActual: Date;
  vistaCalendario: 'semanal' | 'mensual';
}> = ({ medicos, fechaActual, vistaCalendario }) => {
  
  if (vistaCalendario === 'semanal') {
    const dias = Array.from({ length: 7 }, (_, i) => {
      const fecha = new Date(fechaActual);
      fecha.setDate(fechaActual.getDate() + i);
      return fecha;
    });

    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Calendario de Guardias - Vista Semanal
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Casa/Grupo</th>
                {dias.map((dia, index) => (
                  <th key={index} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase min-w-32">
                    <div className="font-medium">
                      {dia.toLocaleDateString('es-ES', { weekday: 'short' })}
                    </div>
                    <div className="text-xs text-gray-400">
                      {dia.getDate()}/{dia.getMonth() + 1}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gruposGuardia.map(grupo => (
                <tr key={grupo.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${grupo.color} mr-3`}></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {grupo.casa} {grupo.nombre}
                        </div>
                        <div className="text-xs text-gray-500">Grupo {grupo.id}</div>
                      </div>
                    </div>
                  </td>
                  {dias.map((dia, index) => {
                    const grupoEnGuardia = GuardiaCalculator.calcularGrupoGuardia(dia);
                    const medicosEnFranco = GuardiaCalculator.getMedicosEnFranco(dia, medicos);
                    const grupoEnFranco = medicosEnFranco.some(m => m.grupoGuardia === grupo.id);
                    const estaDeGuardia = grupoEnGuardia === grupo.id;
                    const medicosDelGrupo = medicos.filter(m => m.grupoGuardia === grupo.id);
                    
                    return (
                      <td key={index} className="px-4 py-3 text-center">
                        {estaDeGuardia ? (
                          <div className="space-y-1">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium block">
                              EN GUARDIA
                            </span>
                            <div className="text-xs text-gray-600 space-y-1">
                              {medicosDelGrupo.slice(0, 3).map(medico => (
                                <div key={medico.id} className="truncate">
                                  {medico.apellido}
                                </div>
                              ))}
                              {medicosDelGrupo.length > 3 && (
                                <div className="text-gray-400">+{medicosDelGrupo.length - 3} más</div>
                              )}
                            </div>
                          </div>
                        ) : grupoEnFranco ? (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            POST GUARDIA
                          </span>
                        ) : (
                          <div className="space-y-1">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium block">
                              DISPONIBLES
                            </span>
                            <div className="text-xs text-gray-600 space-y-1">
                              {medicosDelGrupo.slice(0, 3).map(medico => (
                                <div key={medico.id} className="truncate">
                                  {medico.apellido}
                                </div>
                              ))}
                              {medicosDelGrupo.length > 3 && (
                                <div className="text-gray-400">+{medicosDelGrupo.length - 3} más</div>
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    // Vista mensual
    const primerDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    const ultimoDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
    const diasMes = [];
    
    for (let d = new Date(primerDia); d <= ultimoDia; d.setDate(d.getDate() + 1)) {
      diasMes.push(new Date(d));
    }

    const semanas = [];
    let semanaActual: Date[] = [];
    
    diasMes.forEach((dia, index) => {
      if (index % 7 === 0 && semanaActual.length > 0) {
        semanas.push(semanaActual);
        semanaActual = [];
      }
      semanaActual.push(dia);
    });
    if (semanaActual.length > 0) semanas.push(semanaActual);

    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Calendario de Guardias - Vista Mensual ({fechaActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })})
          </h3>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(dia => (
              <div key={dia} className="text-center text-sm font-medium text-gray-500 py-2">
                {dia}
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            {semanas.map((semana, semanaIndex) => (
              <div key={semanaIndex} className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }, (_, diaIndex) => {
                  const dia = semana[diaIndex];
                  if (!dia) {
                    return <div key={diaIndex} className="h-20"></div>;
                  }
                  
                  const grupoEnGuardia = GuardiaCalculator.calcularGrupoGuardia(dia);
                  const grupoInfo = GuardiaCalculator.getGrupoInfo(grupoEnGuardia);
                  const esHoy = dia.toDateString() === new Date().toDateString();
                  
                  return (
                    <div key={diaIndex} className={`h-20 border rounded-lg p-2 ${esHoy ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {dia.getDate()}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full text-center ${grupoInfo.colorClaro}`}>
                        <div>{grupoInfo.casa}</div>
                        <div className="font-medium">{grupoInfo.nombre}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  subtitle?: string;
}> = ({ title, value, icon: Icon, color, subtitle }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

// Main Component
const HubMedicina: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [fechaActual, setFechaActual] = useState(new Date());
  const [medicos, setMedicos] = useState<Medico[]>(medicosData);
  const [pisos] = useState<PisoHospital[]>(pisosData);
  const [vistaCalendario, setVistaCalendario] = useState<'semanal' | 'mensual'>('semanal');
  const [eventualidades, setEventualidades] = useState<Eventualidad[]>(eventualidadesData);

  // Modal states for eventualidades
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState<'vacaciones' | 'reasignacion' | 'ausencia_medica'>('vacaciones');
  const [medicoSeleccionado, setMedicoSeleccionado] = useState<Medico | undefined>();

  // Modal states for doctor search
  const [isDoctorSearchOpen, setIsDoctorSearchOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<{sector: string, position: number} | null>(null);
  const [currentDoctorInSlot, setCurrentDoctorInSlot] = useState<Medico | undefined>();

  // Calculate current state
  const medicosEnGuardia = useMemo(() => 
    GuardiaCalculator.getMedicosEnGuardia(fechaActual, medicos), 
    [fechaActual, medicos]
  );
  
  const medicosEnFranco = useMemo(() => 
    GuardiaCalculator.getMedicosEnFranco(fechaActual, medicos), 
    [fechaActual, medicos]
  );

  const medicosDisponibles = useMemo(() => {
    return medicos.map(medico => {
      if (medicosEnGuardia.some(m => m.id === medico.id)) {
        return { ...medico, estado: 'guardia' as const };
      }
      if (medicosEnFranco.some(m => m.id === medico.id)) {
        return { ...medico, estado: 'franco' as const };
      }
      return { ...medico, estado: 'disponible' as const };
    }).filter(m => m.estado === 'disponible');
  }, [medicos, medicosEnGuardia, medicosEnFranco]);

  // Generate alerts
  const alertas = useMemo(() => {
    const alertasGeneradas: Alerta[] = [];
    
    // Alertas de pisos con personal insuficiente
    pisos.forEach(piso => {
      const medicosDelPiso = medicosDisponibles.filter(m => m.pisoAsignado === piso.id);
      
      if (medicosDelPiso.length < piso.minimoMedicos) {
        alertasGeneradas.push({
          id: `alert-${piso.id}`,
          tipo: 'critica',
          piso: piso.nombre,
          mensaje: `Piso por debajo del mínimo requerido`,
          medicosAfectados: medicosDelPiso.length,
          sugerencias: [
            'Reasignar médicos de otros pisos',
            'Contactar médicos de guardia disponibles',
            'Activar protocolo de emergencia'
          ]
        });
      } else if (medicosDelPiso.length === piso.minimoMedicos) {
        alertasGeneradas.push({
          id: `alert-${piso.id}`,
          tipo: 'advertencia',
          piso: piso.nombre,
          mensaje: `Piso con personal mínimo`,
          medicosAfectados: medicosDelPiso.length,
          sugerencias: [
            'Monitorear disponibilidad',
            'Preparar médicos suplentes'
          ]
        });
      }
    });

    // Alertas de eventualidades pendientes
    const eventualidadesPendientes = eventualidades.filter(e => e.estado === 'pendiente');
    if (eventualidadesPendientes.length > 0) {
      alertasGeneradas.push({
        id: 'alert-eventualidades-pendientes',
        tipo: 'advertencia',
        piso: 'Administración',
        mensaje: `${eventualidadesPendientes.length} eventualidades pendientes de aprobación`,
        medicosAfectados: eventualidadesPendientes.length,
        sugerencias: [
          'Revisar solicitudes de vacaciones pendientes',
          'Evaluar reasignaciones solicitadas',
          'Aprobar o rechazar licencias médicas'
        ]
      });
    }

    // Alertas de vacaciones próximas a vencer
    const fechaActualStr = fechaActual.toISOString().split('T')[0];
    const vacacionesProximas = medicos.filter(m => 
      m.vacaciones.some(v => {
        const fechaFin = new Date(v.fechaFin);
        const hoy = new Date(fechaActualStr);
        const diferenciaDias = Math.ceil((fechaFin.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
        return diferenciaDias <= 3 && diferenciaDias >= 0;
      })
    );

    if (vacacionesProximas.length > 0) {
      alertasGeneradas.push({
        id: 'alert-vacaciones-proximas',
        tipo: 'info',
        piso: 'Recursos Humanos',
        mensaje: `${vacacionesProximas.length} médicos terminan vacaciones en los próximos 3 días`,
        medicosAfectados: vacacionesProximas.length,
        sugerencias: [
          'Preparar reincorporación al servicio',
          'Actualizar horarios y asignaciones',
          'Notificar al personal de los pisos'
        ]
      });
    }

    // Alertas de reasignaciones temporales activas
    const reasignacionesActivas = medicos.filter(m => m.reasignaciones.length > 0);
    if (reasignacionesActivas.length > 0) {
      alertasGeneradas.push({
        id: 'alert-reasignaciones-activas',
        tipo: 'info',
        piso: 'Administración',
        mensaje: `${reasignacionesActivas.length} médicos en reasignación temporal`,
        medicosAfectados: reasignacionesActivas.length,
        sugerencias: [
          'Monitorear fechas de finalización',
          'Planificar retorno a pisos originales',
          'Evaluar necesidad de extensión'
        ]
      });
    }
    
    return alertasGeneradas;
  }, [pisos, medicosDisponibles, eventualidades, medicos, fechaActual]);

  const grupoActualEnGuardia = useMemo(() => 
    GuardiaCalculator.calcularGrupoGuardia(fechaActual), 
    [fechaActual]
  );

  const grupoInfo = useMemo(() => 
    GuardiaCalculator.getGrupoInfo(grupoActualEnGuardia), 
    [grupoActualEnGuardia]
  );

  // Eventualidad handlers
  const handleVacaciones = (medico: Medico) => {
    setMedicoSeleccionado(medico);
    setModalTipo('vacaciones');
    setIsModalOpen(true);
  };

  const handleReasignacion = (medico: Medico) => {
    setMedicoSeleccionado(medico);
    setModalTipo('reasignacion');
    setIsModalOpen(true);
  };

  const handleAusencia = (medico: Medico) => {
    setMedicoSeleccionado(medico);
    setModalTipo('ausencia_medica');
    setIsModalOpen(true);
  };

  const handleEventualidadSubmit = (nuevaEventualidad: Omit<Eventualidad, 'id'>) => {
    const eventualidad: Eventualidad = {
      ...nuevaEventualidad,
      id: `evt_${Date.now()}`
    };

    setEventualidades(prev => [...prev, eventualidad]);

    // Update medico state based on eventuality type
    setMedicos(prevMedicos => 
      prevMedicos.map(medico => {
        if (medico.id === eventualidad.medicoId) {
          const updatedMedico = { ...medico };
          
          switch (eventualidad.tipo) {
            case 'vacaciones':
              updatedMedico.estado = 'vacaciones';
              updatedMedico.vacaciones = [...medico.vacaciones, {
                fechaInicio: eventualidad.fechaInicio,
                fechaFin: eventualidad.fechaFin,
                motivo: eventualidad.motivo,
                aprobado: true
              }];
              break;
              
            case 'reasignacion':
              updatedMedico.pisoAsignado = eventualidad.detalles?.pisoDestino || medico.pisoAsignado;
              updatedMedico.reasignaciones = [...medico.reasignaciones, {
                fechaInicio: eventualidad.fechaInicio,
                fechaFin: eventualidad.fechaFin,
                pisoAnterior: medico.pisoAsignado,
                pisoNuevo: eventualidad.detalles?.pisoDestino || medico.pisoAsignado,
                motivo: eventualidad.motivo
              }];
              break;
              
            case 'ausencia_medica':
              updatedMedico.estado = 'ausente';
              updatedMedico.ausencias = [...medico.ausencias, eventualidad.motivo];
              break;
          }
          
          return updatedMedico;
        }
        return medico;
      })
    );
  };

  // Doctor assignment handlers
  const handleEditSlot = (sector: string, position: number, currentDoctor?: Medico) => {
    setEditingSlot({ sector, position });
    setCurrentDoctorInSlot(currentDoctor);
    setIsDoctorSearchOpen(true);
  };

  const handleEditDoctor = (medico: Medico) => {
    setCurrentDoctorInSlot(medico);
    setEditingSlot({ sector: medico.pisoAsignado, position: 0 });
    setIsDoctorSearchOpen(true);
  };

  const handleAssignDoctor = (selectedDoctor: Medico | null) => {
    if (!editingSlot) return;

    setMedicos(prevMedicos => {
      return prevMedicos.map(medico => {
        // If removing a doctor (selectedDoctor is null)
        if (!selectedDoctor) {
          if (medico.pisoAsignado === editingSlot.sector) {
            // Remove doctor from this sector (could set to 'Sin Asignar' or similar)
            return { ...medico, pisoAsignado: 'Sin Asignar' };
          }
          return medico;
        }

        // If assigning a new doctor
        if (medico.id === selectedDoctor.id) {
          return { 
            ...medico, 
            pisoAsignado: editingSlot.sector,
            estado: 'disponible' as const
          };
        }

        // If there was a previous doctor in this slot, remove them
        if (currentDoctorInSlot && medico.id === currentDoctorInSlot.id && medico.id !== selectedDoctor.id) {
          return { ...medico, pisoAsignado: 'Sin Asignar' };
        }

        return medico;
      });
    });

    // Close modal and reset state
    setIsDoctorSearchOpen(false);
    setEditingSlot(null);
    setCurrentDoctorInSlot(undefined);
  };

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'sectores', name: 'Sectores', icon: Building },
    { id: 'guardias', name: 'Calendario Guardias', icon: Calendar },
    { id: 'medicos', name: 'Médicos', icon: UserCheck },
    { id: 'eventualidades', name: 'Asistencia', icon: ArrowRightLeft },
    { id: 'alertas', name: 'Alertas', icon: Bell },
    { id: 'reportes', name: 'Reportes', icon: Activity },
    { id: 'configuracion', name: 'Configuración', icon: Settings },
  ];

  const AlertCard: React.FC<{ alerta: Alerta }> = ({ alerta }) => {
    const getAlertColor = () => {
      switch (alerta.tipo) {
        case 'critica': return 'border-red-500 bg-red-50';
        case 'advertencia': return 'border-yellow-500 bg-yellow-50';
        case 'info': return 'border-blue-500 bg-blue-50';
      }
    };

    const getAlertIcon = () => {
      switch (alerta.tipo) {
        case 'critica': return <AlertTriangle className="h-5 w-5 text-red-600" />;
        case 'advertencia': return <Clock className="h-5 w-5 text-yellow-600" />;
        case 'info': return <Bell className="h-5 w-5 text-blue-600" />;
      }
    };

    return (
      <div className={`border-2 rounded-lg p-4 ${getAlertColor()}`}>
        <div className="flex items-start space-x-3">
          {getAlertIcon()}
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">
              {alerta.piso} - {alerta.mensaje}
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              Médicos afectados: {alerta.medicosAfectados}
            </p>
            {alerta.sugerencias.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Sugerencias:</p>
                {alerta.sugerencias.map((sugerencia, index) => (
                  <p key={index} className="text-sm text-gray-600">• {sugerencia}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard - HUB Medicina</h1>
              <div className="flex items-center space-x-4">
                <input
                  type="date"
                  value={fechaActual.toISOString().split('T')[0]}
                  onChange={(e) => setFechaActual(new Date(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard
                title="Grupo en Guardia"
                value={`${grupoInfo.casa} ${grupoInfo.nombre}`}
                icon={Shield}
                color={grupoInfo.color}
                subtitle={`Grupo ${grupoActualEnGuardia}`}
              />
              <MetricCard
                title="Médicos en Guardia"
                value={medicosEnGuardia.length}
                icon={UserCheck}
                color="bg-blue-500"
                subtitle="Activos ahora"
              />
              <MetricCard
                title="Médicos Post Guardia"
                value={medicosEnFranco.length}
                icon={UserX}
                color="bg-gray-500"
                subtitle="En franco"
              />
              <MetricCard
                title="Alertas Activas"
                value={alertas.length}
                icon={AlertTriangle}
                color={alertas.some(a => a.tipo === 'critica') ? 'bg-red-500' : 'bg-yellow-500'}
                subtitle={alertas.some(a => a.tipo === 'critica') ? 'Críticas' : 'Advertencias'}
              />
            </div>

            {/* Alertas */}
            {alertas.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">🚨 Alertas Activas</h2>
                <div className="space-y-3">
                  {alertas.map(alerta => (
                    <AlertCard key={alerta.id} alerta={alerta} />
                  ))}
                </div>
              </div>
            )}

            {/* Tabla de Sectores */}
            <TablaSectoresMedicos
              pisos={pisos}
              medicosDisponibles={medicosDisponibles}
              fecha={fechaActual}
              onEditSlot={handleEditSlot}
              editable={false}
            />
          </div>
        );

      case 'sectores':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Sectores Hospitalarios</h1>
              <div className="flex items-center space-x-4">
                <input
                  type="date"
                  value={fechaActual.toISOString().split('T')[0]}
                  onChange={(e) => setFechaActual(new Date(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <TablaSectoresMedicos
              pisos={pisos}
              medicosDisponibles={medicosDisponibles}
              fecha={fechaActual}
              onEditSlot={handleEditSlot}
              editable={true}
            />
          </div>
        );

      case 'guardias':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Guardias</h1>
              <div className="flex items-center space-x-4">
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <button
                    onClick={() => setVistaCalendario('semanal')}
                    className={`px-4 py-2 text-sm font-medium ${
                      vistaCalendario === 'semanal'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Vista Semanal
                  </button>
                  <button
                    onClick={() => setVistaCalendario('mensual')}
                    className={`px-4 py-2 text-sm font-medium ${
                      vistaCalendario === 'mensual'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Vista Mensual
                  </button>
                </div>
                
                <input
                  type="date"
                  value={fechaActual.toISOString().split('T')[0]}
                  onChange={(e) => setFechaActual(new Date(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <CalendarioGuardias 
              medicos={medicos} 
              fechaActual={fechaActual}
              vistaCalendario={vistaCalendario}
            />

            {/* Información de Casas/Grupos */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Casas de Guardia</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {gruposGuardia.map(grupo => {
                  const medicosDelGrupo = medicos.filter(m => m.grupoGuardia === grupo.id);
                  const estaDeGuardia = grupo.id === grupoActualEnGuardia;
                  
                  return (
                    <div key={grupo.id} className={`border-2 rounded-lg p-4 ${estaDeGuardia ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{grupo.casa}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900">{grupo.nombre}</h4>
                            <p className="text-sm text-gray-600">Grupo {grupo.id}</p>
                          </div>
                        </div>
                        {estaDeGuardia && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            EN GUARDIA
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                          {medicosDelGrupo.length} médicos
                        </p>
                        <div className="text-xs text-gray-600 space-y-1">
                          {medicosDelGrupo.slice(0, 3).map(medico => (
                            <div key={medico.id}>
                              {medico.nombre} {medico.apellido}
                            </div>
                          ))}
                          {medicosDelGrupo.length > 3 && (
                            <div className="text-gray-400">+{medicosDelGrupo.length - 3} más</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'medicos':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Médicos</h1>
              <div className="text-sm text-gray-600">
                Total: {medicos.length} médicos
              </div>
            </div>

            {/* Filtros por estado */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {['disponible', 'guardia', 'franco', 'vacaciones', 'ausente'].map(estado => {
                  const count = medicos.filter(m => {
                    if (estado === 'guardia') return medicosEnGuardia.some(mg => mg.id === m.id);
                    if (estado === 'franco') return medicosEnFranco.some(mf => mf.id === m.id);
                    return m.estado === estado;
                  }).length;
                  
                  const getEstadoColor = () => {
                    switch (estado) {
                      case 'disponible': return 'bg-green-100 text-green-800 border-green-300';
                      case 'guardia': return 'bg-blue-100 text-blue-800 border-blue-300';
                      case 'franco': return 'bg-gray-100 text-gray-800 border-gray-300';
                      case 'vacaciones': return 'bg-purple-100 text-purple-800 border-purple-300';
                      case 'ausente': return 'bg-red-100 text-red-800 border-red-300';
                      default: return 'bg-gray-100 text-gray-800 border-gray-300';
                    }
                  };

                  return (
                    <div key={estado} className={`border rounded-lg p-3 text-center ${getEstadoColor()}`}>
                      <div className="font-bold text-lg">{count}</div>
                      <div className="text-xs capitalize">{estado === 'franco' ? 'Post Guardia' : estado}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grid de médicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {medicos.map(medico => (
                <DoctorCard
                  key={medico.id}
                  medico={medico}
                  onVacaciones={handleVacaciones}
                  onReasignar={handleReasignacion}
                  onAusencia={handleAusencia}
                  onEditDoctor={handleEditDoctor}
                  showActions={true}
                  showEditButton={true}
                />
              ))}
            </div>
          </div>
        );

      case 'eventualidades':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Asistencia</h1>
              <div className="text-sm text-gray-600">
                {eventualidades.length} eventualidades registradas
              </div>
            </div>

            {/* Resumen de eventualidades */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard
                title="Vacaciones Activas"
                value={eventualidades.filter(e => e.tipo === 'vacaciones' && e.estado === 'activo').length}
                icon={Plane}
                color="bg-purple-500"
                subtitle="En curso"
              />
              <MetricCard
                title="Reasignaciones"
                value={eventualidades.filter(e => e.tipo === 'reasignacion' && e.estado === 'activo').length}
                icon={ArrowRightLeft}
                color="bg-blue-500"
                subtitle="Temporales"
              />
              <MetricCard
                title="Ausencias Médicas"
                value={eventualidades.filter(e => e.tipo === 'ausencia_medica').length}
                icon={Shield}
                color="bg-red-500"
                subtitle="Licencias"
              />
              <MetricCard
                title="Pendientes"
                value={eventualidades.filter(e => e.estado === 'pendiente').length}
                icon={Clock}
                color="bg-yellow-500"
                subtitle="Por aprobar"
              />
            </div>

            {/* Lista de eventualidades */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Registro de Eventualidades</h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {eventualidades.map(eventualidad => {
                  const medico = medicos.find(m => m.id === eventualidad.medicoId);
                  if (!medico) return null;

                  const getTipoIcon = () => {
                    switch (eventualidad.tipo) {
                      case 'vacaciones': return <Plane className="h-5 w-5 text-purple-600" />;
                      case 'reasignacion': return <ArrowRightLeft className="h-5 w-5 text-blue-600" />;
                      case 'ausencia_medica': return <Shield className="h-5 w-5 text-red-600" />;
                      default: return <Clock className="h-5 w-5 text-gray-600" />;
                    }
                  };

                  const getEstadoColor = () => {
                    switch (eventualidad.estado) {
                      case 'activo': return 'bg-green-100 text-green-800';
                      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
                      case 'aprobado': return 'bg-blue-100 text-blue-800';
                      case 'rechazado': return 'bg-red-100 text-red-800';
                      default: return 'bg-gray-100 text-gray-800';
                    }
                  };

                  return (
                    <div key={eventualidad.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {getTipoIcon()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-gray-900">
                              {medico.nombre} {medico.apellido}
                            </h4>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor()}`}>
                              {eventualidad.estado.charAt(0).toUpperCase() + eventualidad.estado.slice(1)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Tipo:</strong> {eventualidad.tipo.replace('_', ' ').charAt(0).toUpperCase() + eventualidad.tipo.replace('_', ' ').slice(1)}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Período:</strong> {eventualidad.fechaInicio} - {eventualidad.fechaFin}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Motivo:</strong> {eventualidad.motivo}
                          </div>
                          {eventualidad.tipo === 'reasignacion' && eventualidad.detalles?.pisoOrigen && (
                            <div className="text-sm text-gray-600 mb-2">
                              <strong>Reasignación:</strong> {eventualidad.detalles.pisoOrigen} → {eventualidad.detalles.pisoDestino}
                            </div>
                          )}
                          {eventualidad.detalles?.observaciones && (
                            <div className="text-sm text-gray-500">
                              <strong>Observaciones:</strong> {eventualidad.detalles.observaciones}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {menuItems.find(item => item.id === activeSection)?.name}
            </h1>
            <p className="text-gray-600">Esta sección está en desarrollo.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">HUB-MED</h1>
              <p className="text-sm text-gray-600">Gestión Hospitalaria</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === item.id
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
              {item.id === 'alertas' && alertas.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {alertas.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {renderContent()}
      </div>

      {/* Eventualidad Modal */}
      <EventualidadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        medico={medicoSeleccionado}
        tipo={modalTipo}
        onSubmit={handleEventualidadSubmit}
        pisos={pisos}
      />

      {/* Doctor Search Modal */}
      <DoctorSearchModal
        isOpen={isDoctorSearchOpen}
        onClose={() => {
          setIsDoctorSearchOpen(false);
          setEditingSlot(null);
          setCurrentDoctorInSlot(undefined);
        }}
        onSelectDoctor={handleAssignDoctor}
        currentDoctor={currentDoctorInSlot}
        allDoctors={medicos}
        excludeAssigned={true}
        sector={editingSlot?.sector}
        position={editingSlot?.position}
      />
    </div>
  );
};

export default HubMedicina;