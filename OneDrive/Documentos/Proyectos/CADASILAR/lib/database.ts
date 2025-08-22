import { supabase } from './supabase'

export interface Patient {
  id?: number
  record_id?: number
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
  created_at?: string
  updated_at?: string
}

export const database = {
  // Get all patients
  async getPatients() {
    if (!supabase) {
      console.log('Supabase not configured, using fallback data')
      return []
    }
    
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get patient by ID
  async getPatient(id: number) {
    if (!supabase) return null
    
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new patient
  async createPatient(patient: Patient) {
    if (!supabase) return null
    
    const { data, error } = await supabase
      .from('patients')
      .insert(patient)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update patient
  async updatePatient(id: number, updates: Partial<Patient>) {
    if (!supabase) return null
    
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete patient
  async deletePatient(id: number) {
    if (!supabase) return
    
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Get patients by province
  async getPatientsByProvince(provincia: string) {
    if (!supabase) return []
    
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('provincia', provincia)
    
    if (error) throw error
    return data
  },

  // Get statistics
  async getStats() {
    if (!supabase) {
      return {
        total: 0,
        gender: { male: 0, female: 0 },
        provinces: {},
        age: { average: 0, min: 0, max: 0 }
      }
    }
    
    const { data: patients, error } = await supabase
      .from('patients')
      .select('sexo, provincia, edad_inicio, diagnostico_inicial')
    
    if (error) throw error

    // Calculate basic statistics
    const total = patients.length
    const maleCount = patients.filter(p => p.sexo === 1).length
    const femaleCount = patients.filter(p => p.sexo === 2).length
    
    const provinceStats = patients.reduce((acc: Record<string, number>, patient) => {
      if (patient.provincia) {
        acc[patient.provincia] = (acc[patient.provincia] || 0) + 1
      }
      return acc
    }, {})

    const ageStats = patients
      .filter(p => p.edad_inicio)
      .map(p => p.edad_inicio)
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
  }
}