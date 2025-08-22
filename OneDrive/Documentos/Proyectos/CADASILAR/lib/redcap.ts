// REDCap API Client for CADASILAR

const redcapUrl = process.env.NEXT_PUBLIC_REDCAP_URL
const apiToken = process.env.REDCAP_API_TOKEN

export interface REDCapRecord {
  record_id: string
  redcap_repeat_instrument?: string
  redcap_repeat_instance?: string
  nombre_apellido?: string
  medico_derivante?: string
  institucion?: string
  historia_clinica?: string
  sexo?: string
  provincia?: string
  ciudad?: string
  direccion_aproximada?: string
  fecha_nacimiento?: string
  edad_inicio?: string
  diagnostico_inicial?: string
  resultado_genetico?: string
  exon?: string
  antecedentes_familiares?: string
  valor_mmse_moca1?: string
  valor_mmse_moca2?: string
  [key: string]: any
}

class REDCapClient {
  // Get all records from REDCap via API route
  async getRecords(): Promise<REDCapRecord[]> {
    try {
      const response = await fetch('/api/redcap?action=records')
      
      if (!response.ok) {
        if (response.status === 400) {
          console.log('REDCap not configured, using fallback data')
          return []
        }
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      return data as REDCapRecord[]
    } catch (error) {
      console.error('Error fetching REDCap data:', error)
      return []
    }
  }

  // Get single record by ID
  async getRecord(recordId: string): Promise<REDCapRecord | null> {
    try {
      const response = await fetch(`/api/redcap?action=records&recordId=${recordId}`)
      
      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return data.length > 0 ? data[0] as REDCapRecord : null
    } catch (error) {
      console.error('Error fetching REDCap record:', error)
      return null
    }
  }

  // Create or update a record
  async saveRecord(record: Partial<REDCapRecord>): Promise<any> {
    if (!this.isConfigured()) return null

    try {
      const formData = new FormData()
      formData.append('token', apiToken!)
      formData.append('content', 'record')
      formData.append('action', 'import')
      formData.append('format', 'json')
      formData.append('type', 'flat')
      formData.append('overwriteBehavior', 'normal')
      formData.append('forceAutoNumber', 'false')
      formData.append('data', JSON.stringify([record]))
      formData.append('returnContent', 'count')
      formData.append('returnFormat', 'json')

      const response = await fetch(`${redcapUrl}/api/`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`REDCap API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error saving REDCap record:', error)
      throw error
    }
  }

  // Get project metadata (field definitions)
  async getMetadata(): Promise<any[]> {
    if (!this.isConfigured()) return []

    try {
      const formData = new FormData()
      formData.append('token', apiToken!)
      formData.append('content', 'metadata')
      formData.append('format', 'json')
      formData.append('returnFormat', 'json')

      const response = await fetch(`${redcapUrl}/api/`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`REDCap API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching REDCap metadata:', error)
      throw error
    }
  }
}

export const redcap = new REDCapClient()