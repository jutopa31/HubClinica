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
  Building
} from 'lucide-react';

// Types
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
  { id: '1', nombre: 'Dr. Carlos', apellido: 'González', especialidad: 'Clínica Médica', grupoGuardia: 1, pisoAsignado: '3C', estado: 'disponible', ausencias: [] },
  { id: '2', nombre: 'Dra. María', apellido: 'López', especialidad: 'Clínica Médica', grupoGuardia: 2, pisoAsignado: '3C', estado: 'disponible', ausencias: [] },
  { id: '3', nombre: 'Dr. Luis', apellido: 'Martínez', especialidad: 'Clínica Médica', grupoGuardia: 3, pisoAsignado: '3C', estado: 'disponible', ausencias: [] },
  { id: '4', nombre: 'Dra. Ana', apellido: 'Rodríguez', especialidad: 'Clínica Médica', grupoGuardia: 4, pisoAsignado: '3C', estado: 'disponible', ausencias: [] },
  
  // Piso 3D
  { id: '5', nombre: 'Dr. Pedro', apellido: 'Silva', especialidad: 'Clínica Médica', grupoGuardia: 1, pisoAsignado: '3D', estado: 'disponible', ausencias: [] },
  { id: '6', nombre: 'Dra. Laura', apellido: 'García', especialidad: 'Clínica Médica', grupoGuardia: 2, pisoAsignado: '3D', estado: 'disponible', ausencias: [] },
  { id: '7', nombre: 'Dr. Miguel', apellido: 'Fernández', especialidad: 'Clínica Médica', grupoGuardia: 3, pisoAsignado: '3D', estado: 'disponible', ausencias: [] },
  
  // Piso 4C
  { id: '8', nombre: 'Dra. Carmen', apellido: 'Morales', especialidad: 'Clínica Médica', grupoGuardia: 1, pisoAsignado: '4C', estado: 'disponible', ausencias: [] },
  { id: '9', nombre: 'Dr. Javier', apellido: 'Ruiz', especialidad: 'Clínica Médica', grupoGuardia: 2, pisoAsignado: '4C', estado: 'disponible', ausencias: [] },
  { id: '10', nombre: 'Dra. Isabel', apellido: 'Jiménez', especialidad: 'Clínica Médica', grupoGuardia: 4, pisoAsignado: '4C', estado: 'disponible', ausencias: [] },
  { id: '11', nombre: 'Dr. Roberto', apellido: 'Vázquez', especialidad: 'Clínica Médica', grupoGuardia: 5, pisoAsignado: '4C', estado: 'disponible', ausencias: [] },
  
  // Piso 4D
  { id: '12', nombre: 'Dra. Elena', apellido: 'Castro', especialidad: 'Clínica Médica', grupoGuardia: 1, pisoAsignado: '4D', estado: 'disponible', ausencias: [] },
  { id: '13', nombre: 'Dr. Francisco', apellido: 'Herrera', especialidad: 'Clínica Médica', grupoGuardia: 3, pisoAsignado: '4D', estado: 'disponible', ausencias: [] },
  { id: '14', nombre: 'Dra. Lucía', apellido: 'Mendoza', especialidad: 'Clínica Médica', grupoGuardia: 4, pisoAsignado: '4D', estado: 'disponible', ausencias: [] },
  
  // Piso 5C
  { id: '15', nombre: 'Dr. Antonio', apellido: 'Guerrero', especialidad: 'Clínica Médica', grupoGuardia: 2, pisoAsignado: '5C', estado: 'disponible', ausencias: [] },
  { id: '16', nombre: 'Dra. Teresa', apellido: 'Romero', especialidad: 'Clínica Médica', grupoGuardia: 3, pisoAsignado: '5C', estado: 'disponible', ausencias: [] },
  { id: '17', nombre: 'Dr. Sergio', apellido: 'Blanco', especialidad: 'Clínica Médica', grupoGuardia: 5, pisoAsignado: '5C', estado: 'disponible', ausencias: [] },
  
  // Piso 6C
  { id: '18', nombre: 'Dra. Patricia', apellido: 'Navarro', especialidad: 'Clínica Médica', grupoGuardia: 1, pisoAsignado: '6C', estado: 'disponible', ausencias: [] },
  { id: '19', nombre: 'Dr. Raúl', apellido: 'Ortega', especialidad: 'Clínica Médica', grupoGuardia: 4, pisoAsignado: '6C', estado: 'disponible', ausencias: [] },
  { id: '20', nombre: 'Dra. Cristina', apellido: 'Delgado', especialidad: 'Clínica Médica', grupoGuardia: 5, pisoAsignado: '6C', estado: 'disponible', ausencias: [] },
  
  // Piso 7C
  { id: '21', nombre: 'Dr. Álvaro', apellido: 'Santos', especialidad: 'Clínica Médica', grupoGuardia: 2, pisoAsignado: '7C', estado: 'disponible', ausencias: [] },
  { id: '22', nombre: 'Dra. Mónica', apellido: 'Ramos', especialidad: 'Clínica Médica', grupoGuardia: 3, pisoAsignado: '7C', estado: 'disponible', ausencias: [] },
  { id: '23', nombre: 'Dr. Diego', apellido: 'Vargas', especialidad: 'Clínica Médica', grupoGuardia: 1, pisoAsignado: '7C', estado: 'disponible', ausencias: [] },
  
  // Piso 7D
  { id: '24', nombre: 'Dra. Beatriz', apellido: 'Molina', especialidad: 'Clínica Médica', grupoGuardia: 4, pisoAsignado: '7D', estado: 'disponible', ausencias: [] },
  { id: '25', nombre: 'Dr. Emilio', apellido: 'Prieto', especialidad: 'Clínica Médica', grupoGuardia: 5, pisoAsignado: '7D', estado: 'disponible', ausencias: [] },
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

// Components
const TablaSectoresMedicos: React.FC<{
  pisos: PisoHospital[];
  medicosDisponibles: Medico[];
  fecha: Date;
}> = ({ pisos, medicosDisponibles, fecha }) => {
  
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
          Distribución de Pisos - Clínica Médica - {fecha.toLocaleDateString('es-ES')}
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
                    <td key={piso.id} className="border border-gray-300 p-3 text-center h-16 align-middle">
                      {medico ? (
                        <div className="space-y-1">
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
                        </div>
                      ) : (
                        <div className="text-gray-300 text-xs">—</div>
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
    
    return alertasGeneradas;
  }, [pisos, medicosDisponibles]);

  const grupoActualEnGuardia = useMemo(() => 
    GuardiaCalculator.calcularGrupoGuardia(fechaActual), 
    [fechaActual]
  );

  const grupoInfo = useMemo(() => 
    GuardiaCalculator.getGrupoInfo(grupoActualEnGuardia), 
    [grupoActualEnGuardia]
  );

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'sectores', name: 'Pisos Hospitalarios', icon: Building },
    { id: 'guardias', name: 'Calendario Guardias', icon: Calendar },
    { id: 'medicos', name: 'Médicos', icon: UserCheck },
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
            />
          </div>
        );

      case 'sectores':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Pisos Hospitalarios</h1>
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
    </div>
  );
};

export default HubMedicina;