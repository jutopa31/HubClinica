import { redcap, REDCapRecord } from './redcap'

export interface Patient {
  id?: string
  record_id?: string
  nombre_apellido?: string
  medico_derivante?: string
  institucion?: string
  historia_clinica?: string
  sexo?: number
  provincia?: string
  ciudad?: string
  direccion_aproximada?: string
  fecha_nacimiento?: string
  edad_inicio?: number
  diagnostico_inicial?: number
  resultado_genetico?: string
  exon?: number
  antecedentes_familiares?: number
  valor_mmse_moca1?: number
  valor_mmse_moca2?: number
}

// Transform REDCap data to our app format
function transformREDCapRecord(record: REDCapRecord): Patient {
  return {
    id: record.record_id,
    record_id: record.record_id,
    nombre_apellido: record.nombre_apellido,
    medico_derivante: record.medico_derivante,
    institucion: record.institucion,
    historia_clinica: record.historia_clinica,
    sexo: record.sexo ? parseInt(record.sexo) : undefined,
    provincia: record.provincia,
    ciudad: record.ciudad,
    direccion_aproximada: record.direccion_aproximada,
    fecha_nacimiento: record.fecha_nacimiento,
    edad_inicio: record.edad_inicio ? parseInt(record.edad_inicio) : undefined,
    diagnostico_inicial: record.diagnostico_inicial ? parseInt(record.diagnostico_inicial) : undefined,
    resultado_genetico: record.resultado_genetico,
    exon: record.exon ? parseInt(record.exon) : undefined,
    antecedentes_familiares: record.antecedentes_familiares ? parseInt(record.antecedentes_familiares) : undefined,
    valor_mmse_moca1: record.valor_mmse_moca1 ? parseInt(record.valor_mmse_moca1) : undefined,
    valor_mmse_moca2: record.valor_mmse_moca2 ? parseInt(record.valor_mmse_moca2) : undefined,
  }
}

// Province code mapping (adjust based on your REDCap setup)
const PROVINCE_MAPPING: Record<string, string> = {
  '1': 'Buenos Aires',
  '2': 'Córdoba',
  '3': 'Santa Fe',
  '4': 'Mendoza',
  '5': 'Tucumán',
  '6': 'Entre Ríos',
  '7': 'Salta',
  '8': 'Misiones',
  '9': 'Chaco',
  '10': 'Corrientes',
  '11': 'Santiago del Estero',
  '12': 'San Juan',
  '13': 'Jujuy',
  '14': 'Río Negro',
  '15': 'Neuquén',
  '16': 'Formosa',
  '17': 'Chubut',
  '18': 'San Luis',
  '19': 'Catamarca',
  '20': 'La Rioja',
  '21': 'La Pampa',
  '22': 'Santa Cruz',
  '23': 'Tierra del Fuego',
  '24': 'CABA'
}

export const database = {
  // Get all patients from REDCap
  async getPatients(): Promise<Patient[]> {
    try {
      const records = await redcap.getRecords()
      
      if (!records || records.length === 0) {
        console.log('No REDCap data available, using fallback')
        return []
      }

      // Filter out repeat instruments if needed and transform data
      const mainRecords = records.filter(record => 
        !record.redcap_repeat_instrument || record.redcap_repeat_instrument === ''
      )

      return mainRecords.map(transformREDCapRecord)
    } catch (error) {
      console.error('Error fetching patients from REDCap:', error)
      return []
    }
  },

  // Get patient by ID
  async getPatient(recordId: string): Promise<Patient | null> {
    try {
      const record = await redcap.getRecord(recordId)
      return record ? transformREDCapRecord(record) : null
    } catch (error) {
      console.error('Error fetching patient from REDCap:', error)
      return null
    }
  },

  // Create new patient (save to REDCap)
  async createPatient(patient: Patient): Promise<any> {
    try {
      // Transform back to REDCap format
      const redcapData = {
        record_id: patient.record_id,
        nombre_apellido: patient.nombre_apellido,
        medico_derivante: patient.medico_derivante,
        institucion: patient.institucion,
        historia_clinica: patient.historia_clinica,
        sexo: patient.sexo?.toString(),
        provincia: patient.provincia,
        ciudad: patient.ciudad,
        direccion_aproximada: patient.direccion_aproximada,
        fecha_nacimiento: patient.fecha_nacimiento,
        edad_inicio: patient.edad_inicio?.toString(),
        diagnostico_inicial: patient.diagnostico_inicial?.toString(),
        resultado_genetico: patient.resultado_genetico,
        exon: patient.exon?.toString(),
        antecedentes_familiares: patient.antecedentes_familiares?.toString(),
        valor_mmse_moca1: patient.valor_mmse_moca1?.toString(),
        valor_mmse_moca2: patient.valor_mmse_moca2?.toString(),
      }

      return await redcap.saveRecord(redcapData)
    } catch (error) {
      console.error('Error creating patient in REDCap:', error)
      throw error
    }
  },

  // Update patient
  async updatePatient(recordId: string, updates: Partial<Patient>): Promise<any> {
    try {
      const updateData = {
        record_id: recordId,
        ...Object.entries(updates).reduce((acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = typeof value === 'number' ? value.toString() : value
          }
          return acc
        }, {} as any)
      }

      return await redcap.saveRecord(updateData)
    } catch (error) {
      console.error('Error updating patient in REDCap:', error)
      throw error
    }
  },

  // Get patients by province
  async getPatientsByProvince(provincia: string): Promise<Patient[]> {
    try {
      const allPatients = await this.getPatients()
      return allPatients.filter(patient => 
        patient.provincia === provincia || 
        PROVINCE_MAPPING[patient.provincia || ''] === provincia
      )
    } catch (error) {
      console.error('Error filtering patients by province:', error)
      return []
    }
  },

  // Get statistics
  async getStats() {
    try {
      const patients = await this.getPatients()

      if (!patients || patients.length === 0) {
        return {
          total: 0,
          gender: { male: 0, female: 0 },
          provinces: {},
          age: { average: 0, min: 0, max: 0 }
        }
      }

      const total = patients.length
      const maleCount = patients.filter(p => p.sexo === 1).length
      const femaleCount = patients.filter(p => p.sexo === 2).length
      
      const provinceStats = patients.reduce((acc: Record<string, number>, patient) => {
        const provinceName = PROVINCE_MAPPING[patient.provincia || ''] || patient.provincia || 'Sin especificar'
        acc[provinceName] = (acc[provinceName] || 0) + 1
        return acc
      }, {})

      const ageStats = patients
        .filter(p => p.edad_inicio && p.edad_inicio > 0)
        .map(p => p.edad_inicio!)
        .sort((a, b) => a - b)
      
      const avgAge = ageStats.length > 0 ? 
        ageStats.reduce((sum, age) => sum + age, 0) / ageStats.length : 0

      return {
        total,
        gender: {
          male: maleCount,
          female: femaleCount
        },
        provinces: provinceStats,
        age: {
          average: Math.round(avgAge),
          min: ageStats[0] || 0,
          max: ageStats[ageStats.length - 1] || 0
        }
      }
    } catch (error) {
      console.error('Error calculating stats:', error)
      return {
        total: 0,
        gender: { male: 0, female: 0 },
        provinces: {},
        age: { average: 0, min: 0, max: 0 }
      }
    }
  }
}