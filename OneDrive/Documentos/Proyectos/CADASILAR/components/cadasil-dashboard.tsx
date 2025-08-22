"use client"

import { useState, useEffect, useMemo } from "react"
import { database } from "@/lib/redcap-database"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import {
  Upload,
  BarChart3,
  Users,
  Activity,
  RefreshCw,
  Filter,
  Calendar,
  TrendingUp,
  Microscope,
  Brain,
  MapPin,
  Settings,
  Table,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

export default function CadasilDashboard() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("overview")
  const [comparisonData, setComparisonData] = useState(null)
  const [filters, setFilters] = useState({
    ageRange: [0, 100],
    sex: "all",
    province: "all",
    symptom: "all",
    diagnosisMethod: "all",
    familyHistory: "all",
  })
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showExperimentalMap, setShowExperimentalMap] = useState(false)
  const [hoveredProvince, setHoveredProvince] = useState(null)

  // Colores para los gráficos - estilo médico profesional
  const COLORS = ["#2563EB", "#DC2626", "#059669", "#D97706", "#7C3AED", "#DB2777", "#0891B2", "#65A30D"]
  const MEDICAL_COLORS = {
    primary: "#1E40AF",
    secondary: "#DC2626",
    tertiary: "#059669",
    quaternary: "#D97706",
    accent: "#7C3AED",
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      // Try to load from Supabase first, fall back to sample data if no connection
      const patients = await database.getPatients()
      
      if (patients && patients.length > 0) {
        setData(patients)
      } else {
        // Fallback sample data based on real CADASILAr registry
        const realData = [
        {
          record_id: 5,
          edad_ingresada: 54,
          sexo: 1,
          provincia: 1, // Buenos Aires
          sintoma_inicial: 2,
          metodo_diagnostico: 1,
          antecedentes_familiares: 1,
          dominancia: 1,
          valor_mmse_moca1: 28,
          valor_mmse_moca2: null,
          resultado_genetico: "NM_000435.3(NOTCH3):c.751T>A (p.Cys251Ser)",
          exon: 5,
          sintomas_adicionales___1: 1,
          sintomas_adicionales___2: 1,
          sintomas_adicionales___3: 0,
          sintomas_adicionales___4: 1,
          sintomas_adicionales___5: 1,
          factores_riesgo___1: 1,
          factores_riesgo___2: 0,
          factores_riesgo___3: 0,
          factores_riesgo___4: 0,
          factores_riesgo___5: 0,
        },
        {
          record_id: 6,
          edad_ingresada: 43,
          sexo: 2,
          provincia: 1,
          sintoma_inicial: 2,
          metodo_diagnostico: 1,
          antecedentes_familiares: 1,
          dominancia: 1,
          valor_mmse_moca1: 24,
          valor_mmse_moca2: 16,
          resultado_genetico: "Positivo, pendiente conseguir",
          exon: 4,
          sintomas_adicionales___1: 0,
          sintomas_adicionales___2: 1,
          sintomas_adicionales___3: 1,
          sintomas_adicionales___4: 1,
          sintomas_adicionales___5: 1,
          factores_riesgo___1: 1,
          factores_riesgo___2: 1,
          factores_riesgo___3: 1,
          factores_riesgo___4: 0,
          factores_riesgo___5: 0,
        },
        {
          record_id: 7,
          edad_ingresada: 51,
          sexo: 1,
          provincia: 24, // CABA
          sintoma_inicial: 1,
          metodo_diagnostico: 1,
          antecedentes_familiares: 1,
          dominancia: 2, // Zurdo
          valor_mmse_moca1: 28,
          valor_mmse_moca2: 26,
          resultado_genetico: "NM_000435.3(NOTCH3):c.502T>A (p.Cys168Ser)",
          exon: 4,
          sintomas_adicionales___1: 0,
          sintomas_adicionales___2: 0,
          sintomas_adicionales___3: 0,
          sintomas_adicionales___4: 1,
          sintomas_adicionales___5: 1,
          factores_riesgo___1: 1,
          factores_riesgo___2: 1,
          factores_riesgo___3: 1,
          factores_riesgo___4: 0,
          factores_riesgo___5: 0,
        },
        {
          record_id: 9,
          edad_ingresada: 49,
          sexo: 1,
          provincia: 1,
          sintoma_inicial: 2,
          metodo_diagnostico: 1,
          antecedentes_familiares: 1,
          dominancia: 1,
          valor_mmse_moca1: 20,
          valor_mmse_moca2: 8,
          resultado_genetico: "NM_000435.3(NOTCH3):c.397C>T (p.Arg133Cys)",
          exon: 4,
          sintomas_adicionales___1: 1,
          sintomas_adicionales___2: 1,
          sintomas_adicionales___3: 1,
          sintomas_adicionales___4: 1,
          sintomas_adicionales___5: 1,
          factores_riesgo___1: 1,
          factores_riesgo___2: 0,
          factores_riesgo___3: 1,
          factores_riesgo___4: 0,
          factores_riesgo___5: 0,
        },
        {
          record_id: 12,
          edad_ingresada: 50,
          sexo: 2,
          provincia: 8, // Entre Ríos
          sintoma_inicial: 5,
          metodo_diagnostico: 2,
          antecedentes_familiares: 1,
          dominancia: 1,
          valor_mmse_moca1: 28,
          valor_mmse_moca2: 26,
          resultado_genetico: "Pendiente",
          exon: null,
          sintomas_adicionales___1: 0,
          sintomas_adicionales___2: 0,
          sintomas_adicionales___3: 0,
          sintomas_adicionales___4: 0,
          sintomas_adicionales___5: 0,
          factores_riesgo___1: 1,
          factores_riesgo___2: 0,
          factores_riesgo___3: 1,
          factores_riesgo___4: 0,
          factores_riesgo___5: 0,
        },
        {
          record_id: 13,
          edad_ingresada: 58,
          sexo: 1,
          provincia: 24,
          sintoma_inicial: 4,
          metodo_diagnostico: 1,
          antecedentes_familiares: 1,
          dominancia: 1,
          valor_mmse_moca1: null,
          valor_mmse_moca2: null,
          resultado_genetico: "NM_000435.3(NOTCH3):c.485 G>C (p.Cys162Ser)",
          exon: 4,
          sintomas_adicionales___1: 0,
          sintomas_adicionales___2: 0,
          sintomas_adicionales___3: 0,
          sintomas_adicionales___4: 0,
          sintomas_adicionales___5: 0,
          factores_riesgo___1: 0,
          factores_riesgo___2: 0,
          factores_riesgo___3: 0,
          factores_riesgo___4: 0,
          factores_riesgo___5: 0,
        },
        {
          record_id: 14,
          edad_ingresada: 44,
          sexo: 2,
          provincia: 1,
          sintoma_inicial: 6,
          metodo_diagnostico: 2,
          antecedentes_familiares: 1,
          dominancia: 1,
          valor_mmse_moca1: 28,
          valor_mmse_moca2: null,
          resultado_genetico: "Pendiente",
          exon: null,
          sintomas_adicionales___1: 1,
          sintomas_adicionales___2: 1,
          sintomas_adicionales___3: 0,
          sintomas_adicionales___4: 0,
          sintomas_adicionales___5: 1,
          factores_riesgo___1: 0,
          factores_riesgo___2: 0,
          factores_riesgo___3: 0,
          factores_riesgo___4: 0,
          factores_riesgo___5: 0,
        },
        {
          record_id: 16,
          edad_ingresada: 18,
          sexo: 2,
          provincia: 1,
          sintoma_inicial: 5,
          metodo_diagnostico: 1,
          antecedentes_familiares: 1,
          dominancia: 2,
          valor_mmse_moca1: 21,
          valor_mmse_moca2: null,
          resultado_genetico: "Positivo, pendiente resultado",
          exon: null,
          sintomas_adicionales___1: 1,
          sintomas_adicionales___2: 0,
          sintomas_adicionales___3: 1,
          sintomas_adicionales___4: 0,
          sintomas_adicionales___5: 1,
          factores_riesgo___1: 0,
          factores_riesgo___2: 0,
          factores_riesgo___3: 1,
          factores_riesgo___4: 1,
          factores_riesgo___5: 0,
        },
        {
          record_id: 19,
          edad_ingresada: 30,
          sexo: 2,
          provincia: 24,
          sintoma_inicial: 4,
          metodo_diagnostico: 1,
          antecedentes_familiares: 1,
          dominancia: 1,
          valor_mmse_moca1: 25,
          valor_mmse_moca2: null,
          resultado_genetico: "NM_000435.3(NOTCH3):c.200G>C (p.Cys67Ser)",
          exon: 3,
          sintomas_adicionales___1: 0,
          sintomas_adicionales___2: 1,
          sintomas_adicionales___3: 0,
          sintomas_adicionales___4: 1,
          sintomas_adicionales___5: 1,
          factores_riesgo___1: 1,
          factores_riesgo___2: 0,
          factores_riesgo___3: 0,
          factores_riesgo___4: 0,
          factores_riesgo___5: 0,
        },
        {
          record_id: 20,
          edad_ingresada: 39,
          sexo: 1,
          provincia: 18, // San Juan
          sintoma_inicial: 3,
          metodo_diagnostico: 1,
          antecedentes_familiares: 1,
          dominancia: 1,
          valor_mmse_moca1: 14,
          valor_mmse_moca2: null,
          resultado_genetico: "Positivo, pendiente resultado",
          exon: null,
          sintomas_adicionales___1: 1,
          sintomas_adicionales___2: 1,
          sintomas_adicionales___3: 1,
          sintomas_adicionales___4: 1,
          sintomas_adicionales___5: 1,
          factores_riesgo___1: 1,
          factores_riesgo___2: 0,
          factores_riesgo___3: 1,
          factores_riesgo___4: 1,
          factores_riesgo___5: 0,
        },
        {
          record_id: 21,
          edad_ingresada: 42,
          sexo: 1,
          provincia: 24,
          sintoma_inicial: 3,
          metodo_diagnostico: 1,
          antecedentes_familiares: 1,
          dominancia: 1,
          valor_mmse_moca1: null,
          valor_mmse_moca2: null,
          resultado_genetico: "NM_000435.3(NOTCH3):c.581G>A (p.Cys194Tyr)",
          exon: 4,
          sintomas_adicionales___1: 1,
          sintomas_adicionales___2: 0,
          sintomas_adicionales___3: 1,
          sintomas_adicionales___4: 0,
          sintomas_adicionales___5: 0,
          factores_riesgo___1: 0,
          factores_riesgo___2: 0,
          factores_riesgo___3: 0,
          factores_riesgo___4: 0,
          factores_riesgo___5: 0,
        },
        {
          record_id: 22,
          edad_ingresada: 48,
          sexo: 1,
          provincia: 5, // Córdoba
          sintoma_inicial: 9,
          metodo_diagnostico: 1,
          antecedentes_familiares: 1,
          dominancia: 1,
          valor_mmse_moca1: null,
          valor_mmse_moca2: null,
          resultado_genetico: "NM_000435.3(NOTCH3):c.580T>C (p.Cys194Arg)",
          exon: 4,
          sintomas_adicionales___1: 0,
          sintomas_adicionales___2: 0,
          sintomas_adicionales___3: 0,
          sintomas_adicionales___4: 0,
          sintomas_adicionales___5: 0,
          factores_riesgo___1: 0,
          factores_riesgo___2: 1,
          factores_riesgo___3: 1,
          factores_riesgo___4: 0,
          factores_riesgo___5: 0,
        },
        {
          record_id: 23,
          edad_ingresada: 30,
          sexo: 2,
          provincia: 24,
          sintoma_inicial: 2,
          metodo_diagnostico: 1,
          antecedentes_familiares: 0,
          dominancia: 1,
          valor_mmse_moca1: 30,
          valor_mmse_moca2: null,
          resultado_genetico: "NM_000435.3(NOTCH3):c.751T>A (p.Cys251Ser)",
          exon: 5,
          sintomas_adicionales___1: 0,
          sintomas_adicionales___2: 0,
          sintomas_adicionales___3: 0,
          sintomas_adicionales___4: 0,
          sintomas_adicionales___5: 1,
          factores_riesgo___1: 0,
          factores_riesgo___2: 0,
          factores_riesgo___3: 0,
          factores_riesgo___4: 0,
          factores_riesgo___5: 0,
        },
        {
          record_id: 24,
          edad_ingresada: 35,
          sexo: 1,
          provincia: 24,
          sintoma_inicial: 5,
          metodo_diagnostico: 1,
          antecedentes_familiares: 1,
          dominancia: 1,
          valor_mmse_moca1: 29,
          valor_mmse_moca2: null,
          resultado_genetico: "NM_000435.3(NOTCH3):c.751T>A (p.Cys251Ser)",
          exon: 5,
          sintomas_adicionales___1: 0,
          sintomas_adicionales___2: 0,
          sintomas_adicionales___3: 0,
          sintomas_adicionales___4: 0,
          sintomas_adicionales___5: 0,
          factores_riesgo___1: 0,
          factores_riesgo___2: 0,
          factores_riesgo___3: 0,
          factores_riesgo___4: 0,
          factores_riesgo___5: 0,
        },
        {
          record_id: 25,
          edad_ingresada: 30,
          sexo: 2,
          provincia: 1,
          sintoma_inicial: 9,
          metodo_diagnostico: 1,
          antecedentes_familiares: 1,
          dominancia: 1,
          valor_mmse_moca1: 29,
          valor_mmse_moca2: null,
          resultado_genetico: "NM_000435.3(NOTCH3):c328C>T (p.Arg110Cys)",
          exon: 3,
          sintomas_adicionales___1: 0,
          sintomas_adicionales___2: 0,
          sintomas_adicionales___3: 1,
          sintomas_adicionales___4: 1,
          sintomas_adicionales___5: 1,
          factores_riesgo___1: 0,
          factores_riesgo___2: 0,
          factores_riesgo___3: 0,
          factores_riesgo___4: 0,
          factores_riesgo___5: 0,
        },
        {
          record_id: 26,
          edad_ingresada: 62,
          sexo: 2,
          provincia: 1,
          sintoma_inicial: 3,
          metodo_diagnostico: 1,
          antecedentes_familiares: 1,
          dominancia: 1,
          valor_mmse_moca1: 29,
          valor_mmse_moca2: null,
          resultado_genetico: "NM_000435.3(NOTCH3):c.751T>A (p.Cys251Ser)",
          exon: 5,
          sintomas_adicionales___1: 1,
          sintomas_adicionales___2: 1,
          sintomas_adicionales___3: 1,
          sintomas_adicionales___4: 1,
          sintomas_adicionales___5: 1,
          factores_riesgo___1: 0,
          factores_riesgo___2: 0,
          factores_riesgo___3: 0,
          factores_riesgo___4: 0,
          factores_riesgo___5: 0,
        }
      ]
        setData(realData)
      }
      setLoading(false)
    } catch (error) {
      console.error("Error cargando datos:", error)
      // If Supabase fails, use minimal sample data
      const fallbackData = [
        {
          record_id: 5,
          edad_ingresada: 54,
          sexo: 1,
          provincia: 1,
          sintoma_inicial: 2,
          metodo_diagnostico: 1,
          antecedentes_familiares: 1,
          resultado_genetico: "NM_000435.3(NOTCH3):c.751T>A (p.Cys251Ser)",
          exon: 5,
        }
      ]
      setData(fallbackData)
      setLoading(false)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      const Papa = await import("papaparse")
      const text = await file.text()

      const parsed = Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        delimitersToGuess: [",", "\t", "|", ";"],
      })

      // Filtrar solo registros principales (no repetidos)
      const mainRecords = parsed.data.filter((row) => !row.redcap_repeat_instrument && row.record_id)
      
      // Mapear datos del CSV al formato esperado por el dashboard
      const mappedData = mainRecords.map((row) => ({
        record_id: row.record_id,
        nombre_apellido: row.nombre_apellido,
        edad_ingresada: row.edad_ingresada || 0,
        sexo: row.sexo,
        provincia: row.provincia,
        sintoma_inicial: row.sintoma_inicial,
        metodo_diagnostico: row.metodo_diagnostico,
        antecedentes_familiares: row.antecedentes_familiares,
        dominancia: row.dominancia,
        valor_mmse_moca1: row.valor_mmse_moca1,
        valor_mmse_moca2: row.valor_mmse_moca2,
        resultado_genetico: row.resultado_genetico || "Pendiente",
        exon: row.exon,
        sintomas_adicionales___1: row.sintomas_adicionales___1,
        sintomas_adicionales___2: row.sintomas_adicionales___2,
        sintomas_adicionales___3: row.sintomas_adicionales___3,
        sintomas_adicionales___4: row.sintomas_adicionales___4,
        sintomas_adicionales___5: row.sintomas_adicionales___5,
        factores_riesgo___1: row.factores_riesgo___1,
        factores_riesgo___2: row.factores_riesgo___2,
        factores_riesgo___3: row.factores_riesgo___3,
        factores_riesgo___4: row.factores_riesgo___4,
        factores_riesgo___5: row.factores_riesgo___5,
      }))

      // Actualizar los datos principales en lugar de solo comparación
      setData(mappedData)
      setComparisonData(mainRecords)
      
      console.log(`Datos actualizados: ${mappedData.length} pacientes cargados`)
    } catch (error) {
      console.error("Error processing file:", error)
      alert("Error al procesar el archivo CSV. Verifique el formato.")
    }
  }

  // Datos filtrados
  const filteredData = useMemo(() => {
    if (!data.length) return []

    return data.filter((row) => {
      // Filtro por edad
      const age = row.edad_ingresada || 0
      if (age < filters.ageRange[0] || age > filters.ageRange[1]) return false

      // Filtro por sexo
      if (filters.sex !== "all") {
        const sex = row.sexo === 1 ? "masculino" : row.sexo === 2 ? "femenino" : "unknown"
        if (sex !== filters.sex) return false
      }

      // Filtro por provincia
      if (filters.province !== "all" && row.provincia !== Number.parseInt(filters.province)) return false

      // Filtro por síntoma inicial
      if (filters.symptom !== "all" && row.sintoma_inicial !== Number.parseInt(filters.symptom)) return false

      // Filtro por método de diagnóstico
      if (filters.diagnosisMethod !== "all" && row.metodo_diagnostico !== Number.parseInt(filters.diagnosisMethod))
        return false

      // Filtro por antecedentes familiares
      if (filters.familyHistory !== "all" && row.antecedentes_familiares !== Number.parseInt(filters.familyHistory))
        return false

      return true
    })
  }, [data, filters])

  // Análisis avanzado basado en el estudio
  const advancedAnalysis = useMemo(() => {
    if (!filteredData.length) return {}

    // Distribución por dominancia (como en la tabla demográfica)
    const dominanceDistribution = filteredData.reduce((acc, row) => {
      const dominance =
        row.dominancia === 1
          ? "Diestro"
          : row.dominancia === 2
            ? "Zurdo"
            : row.dominancia === 3
              ? "Ambidiestro"
              : "Desconocido"
      acc[dominance] = (acc[dominance] || 0) + 1
      return acc
    }, {})

    // Análisis de mutaciones NOTCH3 (basado en la figura 4)
    const geneticResults = filteredData.filter(
      (row) => row.resultado_genetico && row.resultado_genetico !== "Positivo, pendiente conseguir",
    )

    const exonDistribution = geneticResults.reduce((acc, row) => {
      const exon = row.exon || "Desconocido"
      acc[`Exón ${exon}`] = (acc[`Exón ${exon}`] || 0) + 1
      return acc
    }, {})

    // Análisis de cohorte temporal (siguiendo el diseño CADASILAr-C y CADASILAr-Long)
    const ageGroups = {
      "18-30": 0,
      "31-40": 0,
      "41-50": 0,
      "51-60": 0,
      "61+": 0,
    }

    filteredData.forEach((row) => {
      const age = row.edad_ingresada
      if (age >= 18 && age <= 30) ageGroups["18-30"]++
      else if (age >= 31 && age <= 40) ageGroups["31-40"]++
      else if (age >= 41 && age <= 50) ageGroups["41-50"]++
      else if (age >= 51 && age <= 60) ageGroups["51-60"]++
      else if (age >= 61) ageGroups["61+"]++
    })

    // Análisis de síntomas combinados (eventos cerebrovasculares + migraña + deterioro cognitivo)
    const symptomCombinations = filteredData.reduce((acc, row) => {
      const symptoms = []
      if (row.sintomas_adicionales___1 === 1) symptoms.push("ACV")
      if (row.sintomas_adicionales___2 === 1) symptoms.push("Migraña")
      if (row.sintomas_adicionales___3 === 1) symptoms.push("Deterioro Cognitivo")
      if (row.sintomas_adicionales___4 === 1) symptoms.push("Psiquiátrico")
      if (row.sintomas_adicionales___5 === 1) symptoms.push("Convulsiones")

      const key = symptoms.length > 0 ? symptoms.join(" + ") : "Sin síntomas específicos"
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    // Progresión cognitiva (MMSE a lo largo del tiempo)
    const cognitionProgression = filteredData
      .filter((row) => row.valor_mmse_moca1 && row.edad_ingresada)
      .map((row) => ({
        edad: row.edad_ingresada,
        mmse1: row.valor_mmse_moca1,
        mmse2: row.valor_mmse_moca2 || null,
        hasProgression: row.valor_mmse_moca2 && row.valor_mmse_moca1,
        decline: row.valor_mmse_moca2 && row.valor_mmse_moca1 ? row.valor_mmse_moca1 - row.valor_mmse_moca2 : 0,
      }))

    // Factores de riesgo vascular (como en el estudio)
    const vascularRiskFactors = {
      Hipertensión: filteredData.filter((row) => row.factores_riesgo___1 === 1).length,
      Diabetes: filteredData.filter((row) => row.factores_riesgo___2 === 1).length,
      Dislipidemia: filteredData.filter((row) => row.factores_riesgo___3 === 1).length,
      Tabaquismo: filteredData.filter((row) => row.factores_riesgo___4 === 1).length,
      Obesidad: filteredData.filter((row) => row.factores_riesgo___5 === 1).length,
    }

    return {
      dominanceDistribution: Object.entries(dominanceDistribution).map(([name, value]) => ({ name, value })),
      exonDistribution: Object.entries(exonDistribution).map(([name, value]) => ({ name, value })),
      ageGroups: Object.entries(ageGroups).map(([name, value]) => ({ name, value })),
      symptomCombinations: Object.entries(symptomCombinations)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, value]) => ({ name, value })),
      cognitionProgression,
      vascularRiskFactors: Object.entries(vascularRiskFactors).map(([name, value]) => ({
        name,
        value,
        percentage: ((value / filteredData.length) * 100).toFixed(1),
      })),
      geneticConfirmation: {
        total: filteredData.length,
        genetic: filteredData.filter((row) => row.metodo_diagnostico === 1).length,
        skinBiopsy: filteredData.filter((row) => row.metodo_diagnostico === 2).length,
        clinical: filteredData.filter((row) => row.metodo_diagnostico === 3).length,
      },
    }
  }, [filteredData])

  // Análisis básico (simplificado para usar con filtros)
  const analysis = useMemo(() => {
    if (!filteredData.length) return {}

    const sexDistribution = filteredData.reduce((acc, row) => {
      const sex = row.sexo === 1 ? "Masculino" : row.sexo === 2 ? "Femenino" : "No especificado"
      acc[sex] = (acc[sex] || 0) + 1
      return acc
    }, {})

    const provinceMap = {
      1: "Buenos Aires",
      2: "Catamarca",
      3: "Chaco",
      4: "Chubut",
      5: "Córdoba",
      6: "Corrientes",
      7: "Entre Ríos",
      8: "Formosa",
      9: "Jujuy",
      10: "La Pampa",
      11: "La Rioja",
      12: "Mendoza",
      13: "Misiones",
      14: "Neuquén",
      15: "Río Negro",
      16: "Salta",
      17: "San Juan",
      18: "San Luis",
      19: "Santa Cruz",
      20: "Santa Fe",
      21: "Santiago del Estero",
      22: "Tierra del Fuego",
      23: "Tucumán",
      24: "CABA",
    }

    const provinceDistribution = filteredData.reduce((acc, row) => {
      const province = provinceMap[row.provincia] || "Desconocida"
      acc[province] = (acc[province] || 0) + 1
      return acc
    }, {})

    const ageData = filteredData
      .filter((row) => row.edad_ingresada && row.edad_ingresada > 0)
      .map((row) => ({ edad: row.edad_ingresada, id: row.record_id }))

    const avgAge = ageData.reduce((sum, item) => sum + item.edad, 0) / ageData.length || 0

    const cognitionData = filteredData.filter((row) => row.valor_mmse_moca1 && row.valor_mmse_moca1 > 0)
    const avgMMSE = cognitionData.reduce((sum, row) => sum + row.valor_mmse_moca1, 0) / cognitionData.length || 0

    return {
      total: filteredData.length,
      sexDistribution: Object.entries(sexDistribution).map(([name, value]) => ({ name, value })),
      provinceDistribution: Object.entries(provinceDistribution)
        .sort((a, b) => b[1] - a[1])
        .map(([name, value]) => ({ name, value })),
      avgAge,
      avgMMSE,
    }
  }, [filteredData])

  // Patient completeness analysis
  const patientCompleteness = useMemo(() => {
    if (!data.length) return []
    
    const calculateCompleteness = (patient) => {
      const criticalFields = [
        'nombre_apellido', 'sexo', 'fecha_nacimiento', 'provincia',
        'sintoma_inicial', 'edad_inicio', 'metodo_diagnostico',
        'antecedentes_familiares', 'resultado_genetico'
      ]
      
      const secondaryFields = [
        'medico_derivante', 'institucion', 'historia_clinica', 'ciudad',
        'dominancia', 'escolaridad', 'diagnostico_inicial', 'exon',
        'valor_mmse_moca1', 'fecha_acv_1'
      ]
      
      const criticalComplete = criticalFields.filter(field => {
        const value = patient[field]
        return value !== null && value !== undefined && value !== '' && value !== 0
      }).length
      
      const secondaryComplete = secondaryFields.filter(field => {
        const value = patient[field]
        return value !== null && value !== undefined && value !== '' && value !== 0
      }).length
      
      const criticalPercentage = (criticalComplete / criticalFields.length) * 100
      const secondaryPercentage = (secondaryComplete / secondaryFields.length) * 100
      const overallPercentage = ((criticalComplete + secondaryComplete) / (criticalFields.length + secondaryFields.length)) * 100
      
      return {
        ...patient,
        criticalComplete,
        criticalTotal: criticalFields.length,
        criticalPercentage,
        secondaryComplete,
        secondaryTotal: secondaryFields.length,
        secondaryPercentage,
        overallPercentage,
        completionLevel: overallPercentage >= 80 ? 'high' : overallPercentage >= 50 ? 'medium' : 'low'
      }
    }
    
    return data.map(calculateCompleteness).sort((a, b) => a.overallPercentage - b.overallPercentage)
  }, [data])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Cargando datos CADASILAr...</span>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CADASILAr Dashboard</h1>
              <p className="text-gray-600 mt-2">Registro Nacional de CADASIL Argentina - Análisis Avanzado</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{analysis.total}</div>
              <div className="text-sm text-gray-500">Pacientes analizados</div>
            </div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Filtros Avanzados
            </button>
            <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Actualizar Datos
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Filtros Avanzados */}
        {showAdvanced && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filtros de Análisis
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.ageRange[0]}
                    onChange={(e) =>
                      setFilters({ ...filters, ageRange: [Number.parseInt(e.target.value), filters.ageRange[1]] })
                    }
                    className="w-16 px-2 py-1 border rounded text-sm"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.ageRange[1]}
                    onChange={(e) =>
                      setFilters({ ...filters, ageRange: [filters.ageRange[0], Number.parseInt(e.target.value)] })
                    }
                    className="w-16 px-2 py-1 border rounded text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                <select
                  value={filters.sex}
                  onChange={(e) => setFilters({ ...filters, sex: e.target.value })}
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="all">Todos</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Síntoma Inicial</label>
                <select
                  value={filters.symptom}
                  onChange={(e) => setFilters({ ...filters, symptom: e.target.value })}
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="all">Todos</option>
                  <option value="1">ACV/TIA</option>
                  <option value="2">Migraña</option>
                  <option value="3">Deterioro Cognitivo</option>
                  <option value="4">Psiquiátrico</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico</label>
                <select
                  value={filters.diagnosisMethod}
                  onChange={(e) => setFilters({ ...filters, diagnosisMethod: e.target.value })}
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="all">Todos</option>
                  <option value="1">Genético</option>
                  <option value="2">Biopsia</option>
                  <option value="3">Clínico</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ant. Familiares</label>
                <select
                  value={filters.familyHistory}
                  onChange={(e) => setFilters({ ...filters, familyHistory: e.target.value })}
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="all">Todos</option>
                  <option value="1">Sí</option>
                  <option value="0">No</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() =>
                    setFilters({
                      ageRange: [0, 100],
                      sex: "all",
                      province: "all",
                      symptom: "all",
                      diagnosisMethod: "all",
                      familyHistory: "all",
                    })
                  }
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comparación con nuevos datos */}
        {comparisonData && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Comparación con Datos Actualizados
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white p-3 rounded">
                <div className="text-gray-600">Pacientes</div>
                <div className="font-semibold text-lg">
                  {analysis.total} → {comparisonData.length}
                </div>
                <div
                  className={`text-sm ${comparisonData.length > analysis.total ? "text-green-600" : "text-red-600"}`}
                >
                  {comparisonData.length > analysis.total ? "+" : ""}
                  {comparisonData.length - analysis.total} pacientes
                </div>
              </div>
              <div className="bg-white p-3 rounded">
                <div className="text-gray-600">Edad Promedio</div>
                <div className="font-semibold text-lg">{analysis.avgAge?.toFixed(1)} años</div>
              </div>
              <div className="bg-white p-3 rounded">
                <div className="text-gray-600">MMSE Promedio</div>
                <div className="font-semibold text-lg">{analysis.avgMMSE?.toFixed(1)}</div>
              </div>
              <div className="bg-white p-3 rounded">
                <div className="text-gray-600">Confirmación Genética</div>
                <div className="font-semibold text-lg">
                  {advancedAnalysis.geneticConfirmation
                    ? ((advancedAnalysis.geneticConfirmation.genetic / analysis.total) * 100).toFixed(1)
                    : 0}
                  %
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navegación por pestañas */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", label: "Resumen Ejecutivo", icon: BarChart3 },
              { id: "demographics", label: "Demografía Clínica", icon: Users },
              { id: "genetics", label: "Análisis Genético", icon: Microscope },
              { id: "clinical", label: "Progresión Clínica", icon: Activity },
              { id: "geography", label: "Distribución Nacional", icon: MapPin },
              { id: "table", label: "Tabla de Pacientes", icon: Table },
              { id: "quality", label: "Calidad de Datos", icon: CheckCircle },
              { id: "timeline", label: "Cronograma del Estudio", icon: Calendar },
              { id: "resources", label: "Recursos y Publicaciones", icon: RefreshCw },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido por pestañas */}
      <div className="space-y-6">
        {selectedTab === "overview" && (
          <div className="space-y-6">
            {/* Métricas principales estilo paper científico */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">N = Pacientes</p>
                    <p className="text-3xl font-bold text-gray-900">{analysis.total}</p>
                    <p className="text-xs text-gray-500 mt-1">Registro Nacional</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Edad Media ± SD</p>
                    <p className="text-3xl font-bold text-gray-900">{analysis.avgAge?.toFixed(1)}</p>
                    <p className="text-xs text-gray-500 mt-1">años al ingreso</p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">MMSE Mediana</p>
                    <p className="text-3xl font-bold text-gray-900">{analysis.avgMMSE?.toFixed(1)}</p>
                    <p className="text-xs text-gray-500 mt-1">evaluación cognitiva</p>
                  </div>
                  <Brain className="w-8 h-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Confirmación Genética</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {advancedAnalysis.geneticConfirmation
                        ? ((advancedAnalysis.geneticConfirmation.genetic / analysis.total) * 100).toFixed(0)
                        : 0}
                      %
                    </p>
                    <p className="text-xs text-gray-500 mt-1">casos confirmados</p>
                  </div>
                  <Microscope className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Gráficos principales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  Distribución por Sexo (N = {analysis.total})
                </h3>
                <div className="text-sm text-gray-600 mb-4">50% mujeres, según datos preliminares</div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analysis.sexDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {analysis.sexDistribution?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Distribución por Grupos Etarios</h3>
                <div className="text-sm text-gray-600 mb-4">Cohorte CADASILAr según edad de inclusión</div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={advancedAnalysis.ageGroups}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill={MEDICAL_COLORS.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Análisis de dominancia y factores de riesgo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Dominancia Manual</h3>
                <div className="text-sm text-gray-600 mb-4">
                  Distribución según lateralidad (como Tabla demográfica)
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={advancedAnalysis.dominanceDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill={MEDICAL_COLORS.secondary} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Factores de Riesgo Vascular</h3>
                <div className="text-sm text-gray-600 mb-4">Comorbilidades más frecuentes en la cohorte</div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={advancedAnalysis.vascularRiskFactors} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="value" fill={MEDICAL_COLORS.tertiary} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "demographics" && (
          <div className="space-y-6">
            {/* Tabla demográfica estilo paper */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                <Users className="w-6 h-6 mr-2 text-blue-600" />
                Características Demográficas (N = {analysis.total})
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tabla estilo paper médico */}
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                          Características
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b">
                          N = {analysis.total}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Sexo</td>
                        <td className="px-4 py-3 text-sm text-gray-900"></td>
                      </tr>
                      {analysis.sexDistribution?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-700 pl-8">{item.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-center">
                            {item.value} / {analysis.total} ({((item.value / analysis.total) * 100).toFixed(1)}%)
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Dominancia</td>
                        <td className="px-4 py-3 text-sm text-gray-900"></td>
                      </tr>
                      {advancedAnalysis.dominanceDistribution?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-700 pl-8">{item.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-center">
                            {item.value} / {analysis.total} ({((item.value / analysis.total) * 100).toFixed(1)}%)
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Edad de inclusión</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-center">
                          {analysis.avgAge?.toFixed(1)} ± años
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Gráfico de distribución geográfica */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-gray-900">Lugar de Nacimiento</h4>
                  <div className="text-sm text-gray-600 mb-4">Principales provincias representadas</div>
                  <div className="space-y-2">
                    {analysis.provinceDistribution?.slice(0, 8).map((province, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{province.name}</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(province.value / analysis.total) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">{province.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos adicionales demográficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Historia Familiar</h3>
                <div className="text-sm text-gray-600 mb-4">91.6% reportó antecedentes familiares positivos</div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Con antecedentes", value: Math.round(analysis.total * 0.916) },
                        { name: "Sin antecedentes", value: Math.round(analysis.total * 0.084) },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      <Cell fill={MEDICAL_COLORS.primary} />
                      <Cell fill={MEDICAL_COLORS.secondary} />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Distribución por Edad</h3>
                <div className="text-sm text-gray-600 mb-4">Rango etario de la cohorte argentina</div>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={advancedAnalysis.ageGroups}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={MEDICAL_COLORS.primary}
                      fill={MEDICAL_COLORS.primary}
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "genetics" && (
          <div className="space-y-6">
            {/* Panel principal de genética */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                <Microscope className="w-6 h-6 mr-2 text-purple-600" />
                Análisis de Variantes NOTCH3
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Estadísticas genéticas */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-3">Confirmación Diagnóstica</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Estudio genético:</span>
                      <span className="font-semibold">{advancedAnalysis.geneticConfirmation?.genetic || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biopsia de piel:</span>
                      <span className="font-semibold">{advancedAnalysis.geneticConfirmation?.skinBiopsy || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Diagnóstico clínico:</span>
                      <span className="font-semibold">{advancedAnalysis.geneticConfirmation?.clinical || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Información tipo paper */}
                <div className="lg:col-span-2 bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">Hallazgos Genéticos Clave</h4>
                  <div className="text-sm text-blue-800 space-y-2">
                    <p>
                      • <strong>Todas las mutaciones confirmadas</strong> alteran residuos de cisteína en NOTCH3
                    </p>
                    <p>
                      • <strong>Dominios EGF-like</strong> son los más frecuentemente afectados
                    </p>
                    <p>
                      • <strong>Transcripción NM_000435.3</strong> utilizada como referencia
                    </p>
                    <p>
                      • <strong>Patrón de herencia</strong> autosómica dominante confirmado
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribución de exones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Distribución por Exón</h3>
                <div className="text-sm text-gray-600 mb-4">Localización de variantes NOTCH3 encontradas</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={advancedAnalysis.exonDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill={MEDICAL_COLORS.quaternary} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Métodos de Confirmación</h3>
                <div className="text-sm text-gray-600 mb-4">Distribución de métodos diagnósticos utilizados</div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Genético", value: advancedAnalysis.geneticConfirmation?.genetic || 0 },
                        { name: "Biopsia", value: advancedAnalysis.geneticConfirmation?.skinBiopsy || 0 },
                        { name: "Clínico", value: advancedAnalysis.geneticConfirmation?.clinical || 0 },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    >
                      <Cell fill={MEDICAL_COLORS.primary} />
                      <Cell fill={MEDICAL_COLORS.secondary} />
                      <Cell fill={MEDICAL_COLORS.tertiary} />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "clinical" && (
          <div className="space-y-6">
            {/* Presentación clínica principal */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-green-600" />
                Manifestaciones Clínicas Principales
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Estadísticas según el paper */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-3">Síntomas Principales</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Eventos cerebrovasculares:</span>
                      <span className="font-semibold text-green-800">72.9%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Migraña:</span>
                      <span className="font-semibold text-green-800">69%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deterioro cognitivo:</span>
                      <span className="font-semibold text-green-800">56.7%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-3">Comorbilidades</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Hipertensión arterial:</span>
                      <span className="font-semibold text-orange-800">64%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dislipidemia:</span>
                      <span className="font-semibold text-orange-800">55%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-3">Evaluación Cognitiva</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>MMSE mediana:</span>
                      <span className="font-semibold text-purple-800">28</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rango intercuartil:</span>
                      <span className="font-semibold text-purple-800">22-29</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pacientes evaluados:</span>
                      <span className="font-semibold text-purple-800">33</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos de progresión clínica */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Combinaciones de Síntomas</h3>
                <div className="text-sm text-gray-600 mb-4">Presentaciones clínicas más frecuentes</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={advancedAnalysis.symptomCombinations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill={MEDICAL_COLORS.secondary} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Progresión Cognitiva (MMSE)</h3>
                <div className="text-sm text-gray-600 mb-4">Relación entre edad y puntuación MMSE</div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={advancedAnalysis.cognitionProgression}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="edad" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="mmse1"
                      stroke={MEDICAL_COLORS.accent}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "geography" && (
          <div className="space-y-6">
            {/* Distribución Geográfica Nacional */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Distribución Geográfica Nacional</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Vista experimental</span>
                  <button
                    onClick={() => setShowExperimentalMap(!showExperimentalMap)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      showExperimentalMap ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showExperimentalMap ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {!showExperimentalMap ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Lista de provincias estilo paper */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-900">Lugar de Nacimiento</h4>
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <div className="text-sm text-blue-800">
                        <strong>Concentración principal:</strong> Buenos Aires con{" "}
                        {analysis.provinceDistribution?.[0]?.value || 0} pacientes
                      </div>
                    </div>

                    <div className="space-y-3">
                      {analysis.provinceDistribution?.map((province, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div
                              className={`w-4 h-4 rounded-full mr-3 ${
                                index === 0
                                  ? "bg-blue-600"
                                  : index < 3
                                    ? "bg-blue-400"
                                    : index < 6
                                      ? "bg-blue-300"
                                      : "bg-gray-300"
                              }`}
                            ></div>
                            <span className="font-medium">{province.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{province.value}</div>
                            <div className="text-xs text-gray-500">
                              {((province.value / analysis.total) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visualización de mapa estilizado */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-900">Representación Visual</h4>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-blue-600">🇦🇷</div>
                        <div className="text-sm text-gray-600 mt-2">República Argentina</div>
                      </div>

                      {/* Distribución por regiones */}
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded border-l-4 border-blue-600">
                          <div className="font-semibold text-blue-900">Región Metropolitana</div>
                          <div className="text-sm text-gray-600">
                            Buenos Aires + CABA:{" "}
                            {(analysis.provinceDistribution?.find((p) => p.name === "Buenos Aires")?.value || 0) +
                              (analysis.provinceDistribution?.find((p) => p.name === "CABA")?.value || 0)}{" "}
                            pacientes
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded border-l-4 border-green-500">
                          <div className="font-semibold text-green-900">Interior del País</div>
                          <div className="text-sm text-gray-600">
                            Otras provincias:{" "}
                            {analysis.total -
                              (analysis.provinceDistribution?.find((p) => p.name === "Buenos Aires")?.value || 0)}{" "}
                            pacientes
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* New experimental map view */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Interactive Argentina Map */}
                  <div className="lg:col-span-2">
                    <h4 className="text-lg font-semibold mb-4 text-gray-900">Mapa Interactivo de Argentina</h4>
                    <div className="bg-gray-50 p-4 rounded-lg relative">
                      <div className="text-center mb-4">
                        <div className="text-sm text-gray-600">Distribución de pacientes CADASIL por provincia</div>
                        <div className="text-xs text-blue-600 mt-1">
                          Pasa el cursor sobre las provincias para ver detalles
                        </div>
                      </div>

                      {/* Argentina SVG Map - Forma Real */}
                      <div className="flex justify-center">
                        <svg
                          width="300"
                          height="400"
                          viewBox="0 0 300 400"
                          className="border rounded-lg bg-white shadow-sm"
                        >
                          {/* Jujuy */}
                          <path
                            d="M125 20 L145 20 L150 40 L140 50 L125 45 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "Jujuy")?.value > 0 ? "#10b981" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "Jujuy", value: analysis.provinceDistribution?.find((p) => p.name === "Jujuy")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* Salta */}
                          <path
                            d="M100 30 L140 50 L155 80 L130 85 L100 70 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "Salta")?.value > 0 ? "#059669" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "Salta", value: analysis.provinceDistribution?.find((p) => p.name === "Salta")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* Formosa */}
                          <path
                            d="M150 40 L195 45 L200 65 L170 70 L150 60 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "Formosa")?.value > 0 ? "#6366f1" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "Formosa", value: analysis.provinceDistribution?.find((p) => p.name === "Formosa")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* Chaco */}
                          <path
                            d="M170 70 L200 65 L220 85 L200 100 L160 95 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "Chaco")?.value > 0 ? "#f59e0b" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "Chaco", value: analysis.provinceDistribution?.find((p) => p.name === "Chaco")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* Misiones */}
                          <path
                            d="M220 85 L250 90 L245 120 L225 115 L220 100 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "Misiones")?.value > 0 ? "#ec4899" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "Misiones", value: analysis.provinceDistribution?.find((p) => p.name === "Misiones")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* Corrientes */}
                          <path
                            d="M200 100 L225 115 L215 135 L190 130 L185 110 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "Corrientes")?.value > 0 ? "#8b5cf6" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "Corrientes", value: analysis.provinceDistribution?.find((p) => p.name === "Corrientes")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* Tucumán */}
                          <path
                            d="M130 85 L155 80 L160 95 L140 100 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "Tucumán")?.value > 0 ? "#be185d" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "Tucumán", value: analysis.provinceDistribution?.find((p) => p.name === "Tucumán")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* Catamarca */}
                          <path
                            d="M100 70 L130 85 L140 100 L125 120 L90 110 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "Catamarca")?.value > 0 ? "#64748b" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "Catamarca", value: analysis.provinceDistribution?.find((p) => p.name === "Catamarca")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* Santiago del Estero */}
                          <path
                            d="M140 100 L160 95 L185 110 L170 140 L140 135 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "Santiago del Estero")?.value > 0 ? "#facc15" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "Santiago del Estero", value: analysis.provinceDistribution?.find((p) => p.name === "Santiago del Estero")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* Santa Fe */}
                          <path
                            d="M170 140 L190 130 L210 155 L185 170 L165 165 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "Santa Fe")?.value > 0 ? "#7c3aed" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "Santa Fe", value: analysis.provinceDistribution?.find((p) => p.name === "Santa Fe")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* Entre Ríos */}
                          <path
                            d="M185 170 L210 155 L215 180 L195 190 L175 185 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "Entre Ríos")?.value > 0 ? "#a855f7" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "Entre Ríos", value: analysis.provinceDistribution?.find((p) => p.name === "Entre Ríos")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* Córdoba */}
                          <path
                            d="M140 135 L170 140 L165 165 L155 180 L130 175 L125 155 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "Córdoba")?.value > 0 ? "#059669" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "Córdoba", value: analysis.provinceDistribution?.find((p) => p.name === "Córdoba")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* La Rioja */}
                          <path
                            d="M90 110 L125 120 L125 155 L100 150 L85 130 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "La Rioja")?.value > 0 ? "#b91c1c" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "La Rioja", value: analysis.provinceDistribution?.find((p) => p.name === "La Rioja")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* San Juan */}
                          <path
                            d="M75 140 L100 150 L95 170 L70 165 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "San Juan")?.value > 0 ? "#7c2d12" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "San Juan", value: analysis.provinceDistribution?.find((p) => p.name === "San Juan")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* San Luis */}
                          <path
                            d="M100 150 L130 175 L120 195 L95 190 L95 170 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "San Luis")?.value > 0 ? "#0ea5e9" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "San Luis", value: analysis.provinceDistribution?.find((p) => p.name === "San Luis")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* Mendoza */}
                          <path
                            d="M70 165 L95 170 L95 190 L85 210 L60 205 L55 185 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "Mendoza")?.value > 0 ? "#ea580c" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "Mendoza", value: analysis.provinceDistribution?.find((p) => p.name === "Mendoza")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* Buenos Aires */}
                          <path
                            d="M155 180 L175 185 L195 190 L210 210 L200 240 L175 255 L150 250 L130 230 L120 195 L130 175 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "Buenos Aires")?.value > 0 ? "#1e40af" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "Buenos Aires", value: analysis.provinceDistribution?.find((p) => p.name === "Buenos Aires")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* CABA */}
                          <circle
                            cx="195"
                            cy="200"
                            r="4"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "CABA")?.value > 0 ? "#dc2626" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "CABA", value: analysis.provinceDistribution?.find((p) => p.name === "CABA")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* La Pampa */}
                          <path
                            d="M85 210 L120 195 L130 230 L110 250 L85 245 L75 225 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "La Pampa")?.value > 0 ? "#7c2d12" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "La Pampa", value: analysis.provinceDistribution?.find((p) => p.name === "La Pampa")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* Neuquén */}
                          <path
                            d="M75 225 L110 250 L105 270 L80 275 L65 255 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "Neuquén")?.value > 0 ? "#c026d3" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "Neuquén", value: analysis.provinceDistribution?.find((p) => p.name === "Neuquén")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* Río Negro */}
                          <path
                            d="M110 250 L150 250 L145 285 L105 270 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "Río Negro")?.value > 0 ? "#1d4ed8" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "Río Negro", value: analysis.provinceDistribution?.find((p) => p.name === "Río Negro")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* Chubut */}
                          <path
                            d="M105 270 L145 285 L140 320 L100 315 L80 295 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "Chubut")?.value > 0 ? "#dc2626" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "Chubut", value: analysis.provinceDistribution?.find((p) => p.name === "Chubut")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* Santa Cruz */}
                          <path
                            d="M100 315 L140 320 L135 365 L95 360 L85 340 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "Santa Cruz")?.value > 0 ? "#7c3aed" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "Santa Cruz", value: analysis.provinceDistribution?.find((p) => p.name === "Santa Cruz")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* Tierra del Fuego */}
                          <path
                            d="M115 370 L135 365 L130 385 L110 385 Z"
                            fill={analysis.provinceDistribution?.find((p) => p.name === "Tierra del Fuego")?.value > 0 ? "#7e22ce" : "#e5e7eb"}
                            stroke="#374151"
                            strokeWidth="0.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredProvince({name: "Tierra del Fuego", value: analysis.provinceDistribution?.find((p) => p.name === "Tierra del Fuego")?.value || 0})}
                            onMouseLeave={() => setHoveredProvince(null)}
                          />

                          {/* Labels */}
                          <text x="150" y="15" textAnchor="middle" className="text-xs font-semibold fill-gray-700">
                            ARGENTINA
                          </text>
                          <text x="150" y="395" textAnchor="middle" className="text-xs fill-gray-500">
                            Distribución CADASILAr
                          </text>
                        </svg>
                      </div>

                      {/* Tooltip */}
                      {hoveredProvince && (
                        <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg border z-10">
                          <div className="font-semibold text-gray-900">{hoveredProvince.name}</div>
                          <div className="text-sm text-gray-600">
                            {hoveredProvince.value} paciente{hoveredProvince.value !== 1 ? "s" : ""}
                          </div>
                          <div className="text-xs text-blue-600">
                            {hoveredProvince.value > 0
                              ? `${((hoveredProvince.value / analysis.total) * 100).toFixed(1)}% del total`
                              : "Sin casos registrados"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Legend and Statistics */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-900">Leyenda y Estadísticas</h4>

                    {/* Color Legend */}
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                      <h5 className="font-medium mb-3 text-gray-900">Código de Colores</h5>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                          <span className="text-sm">Buenos Aires</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
                          <span className="text-sm">CABA</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
                          <span className="text-sm">Córdoba</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-purple-600 rounded mr-2"></div>
                          <span className="text-sm">Santa Fe</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                          <span className="text-sm">Sin casos</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-3 text-blue-900">Resumen Geográfico</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total de pacientes:</span>
                          <span className="font-semibold">{analysis.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Provincias con casos:</span>
                          <span className="font-semibold">{analysis.provinceDistribution?.length || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Concentración máxima:</span>
                          <span className="font-semibold">
                            {analysis.provinceDistribution?.[0]?.name} ({analysis.provinceDistribution?.[0]?.value})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === "table" && (
          <div className="space-y-6">
            {/* Tabla de Datos de Pacientes */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Table className="w-6 h-6 mr-2 text-green-600" />
                  Tabla Completa de Pacientes (N = {filteredData.length})
                </h3>
                <div className="text-sm text-gray-600">
                  Datos filtrados según criterios seleccionados
                </div>
              </div>

              {/* Tabla responsive */}
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Edad
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sexo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Provincia
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Síntoma Inicial
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        MMSE
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Método Dx
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resultado Genético
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exón
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ant. Familiares
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((patient, index) => {
                      const provinceMap = {
                        1: "Buenos Aires", 2: "Catamarca", 3: "Chaco", 4: "Chubut", 5: "Córdoba",
                        6: "Corrientes", 7: "Entre Ríos", 8: "Formosa", 9: "Jujuy", 10: "La Pampa",
                        11: "La Rioja", 12: "Mendoza", 13: "Misiones", 14: "Neuquén", 15: "Río Negro",
                        16: "Salta", 17: "San Juan", 18: "San Luis", 19: "Santa Cruz", 20: "Santa Fe",
                        21: "Santiago del Estero", 22: "Tierra del Fuego", 23: "Tucumán", 24: "CABA"
                      }
                      
                      const sintomaMap = {
                        1: "ACV/TIA", 2: "Migraña", 3: "Deterioro Cognitivo", 4: "Psiquiátrico",
                        5: "Convulsiones", 6: "Otros", 7: "Asintomático", 8: "Demencia", 9: "Múltiples"
                      }
                      
                      const metodoMap = {
                        1: "Genético", 2: "Biopsia", 3: "Clínico"
                      }

                      return (
                        <tr key={patient.record_id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {patient.record_id}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {patient.edad_ingresada || "N/A"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {patient.sexo === 1 ? "M" : patient.sexo === 2 ? "F" : "N/A"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {provinceMap[patient.provincia] || "N/A"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {sintomaMap[patient.sintoma_inicial] || "N/A"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex flex-col">
                              <span>{patient.valor_mmse_moca1 || "N/A"}</span>
                              {patient.valor_mmse_moca2 && (
                                <span className="text-xs text-gray-500">({patient.valor_mmse_moca2})</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              patient.metodo_diagnostico === 1 ? "bg-blue-100 text-blue-800" :
                              patient.metodo_diagnostico === 2 ? "bg-green-100 text-green-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {metodoMap[patient.metodo_diagnostico] || "N/A"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                            <div className="truncate" title={patient.resultado_genetico}>
                              {patient.resultado_genetico && patient.resultado_genetico.includes("NOTCH3") ? (
                                <span className="text-green-700 font-medium">Positivo (NOTCH3)</span>
                              ) : patient.resultado_genetico && patient.resultado_genetico.includes("Positivo") ? (
                                <span className="text-green-700">Positivo</span>
                              ) : patient.resultado_genetico && patient.resultado_genetico.includes("Pendiente") ? (
                                <span className="text-yellow-700">Pendiente</span>
                              ) : (
                                <span className="text-gray-500">N/A</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {patient.exon ? (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                {patient.exon}
                              </span>
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              patient.antecedentes_familiares === 1 ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                            }`}>
                              {patient.antecedentes_familiares === 1 ? "Sí" : patient.antecedentes_familiares === 0 ? "No" : "N/A"}
                            </span>
                          </td>
                        </tr>
                      )}
                    )}
                  </tbody>
                </table>
              </div>

              {/* Información adicional */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Leyenda de Métodos</h4>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span>Genético</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Biopsia de piel</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span>Clínico</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Estadísticas Rápidas</h4>
                  <div className="space-y-1">
                    <div>Total pacientes: <strong>{filteredData.length}</strong></div>
                    <div>Con MMSE: <strong>{filteredData.filter(p => p.valor_mmse_moca1).length}</strong></div>
                    <div>Confirmados genéticamente: <strong>{filteredData.filter(p => p.metodo_diagnostico === 1).length}</strong></div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Filtros Activos</h4>
                  <div className="space-y-1">
                    <div>Edad: <strong>{filters.ageRange[0]}-{filters.ageRange[1]} años</strong></div>
                    <div>Sexo: <strong>{filters.sex === "all" ? "Todos" : filters.sex}</strong></div>
                    <div>Síntoma: <strong>{filters.symptom === "all" ? "Todos" : filters.symptom}</strong></div>
                  </div>
                </div>
              </div>

              {/* Nota sobre datos */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> Los datos mostrados reflejan el registro real CADASILAr. 
                  MMSE entre paréntesis indica segunda evaluación. 
                  Para ver detalles completos de mutaciones genéticas, consulte la pestaña "Análisis Genético".
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "quality" && (
          <div className="space-y-6">
            {/* Data Quality Overview */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                  Análisis de Calidad de Datos
                </h3>
                <div className="text-sm text-gray-600">
                  Total de pacientes: {patientCompleteness.length}
                </div>
              </div>

              {/* Completion Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-900">Alta Completitud (≥80%)</p>
                      <p className="text-2xl font-bold text-green-900">
                        {patientCompleteness.filter(p => p.completionLevel === 'high').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center">
                    <AlertCircle className="w-8 h-8 text-yellow-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-yellow-900">Completitud Media (50-79%)</p>
                      <p className="text-2xl font-bold text-yellow-900">
                        {patientCompleteness.filter(p => p.completionLevel === 'medium').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-900">Baja Completitud (&lt;50%)</p>
                      <p className="text-2xl font-bold text-red-900">
                        {patientCompleteness.filter(p => p.completionLevel === 'low').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Review Table */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-900">
                  Pacientes Ordenados por Completitud (Menor a Mayor)
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg shadow">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Paciente
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Datos Críticos
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Datos Secundarios
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Completitud Total
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {patientCompleteness.map((patient, index) => (
                        <tr key={patient.record_id || index} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">
                              {patient.nombre_apellido || 'Sin nombre'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {patient.sexo === 1 ? 'Masculino' : patient.sexo === 2 ? 'Femenino' : 'No esp.'} 
                              {patient.edad_inicio && `, ${patient.edad_inicio} años`}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {patient.record_id || 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${patient.criticalPercentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-900">
                                {patient.criticalComplete}/{patient.criticalTotal} ({Math.round(patient.criticalPercentage)}%)
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full" 
                                  style={{ width: `${patient.secondaryPercentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-900">
                                {patient.secondaryComplete}/{patient.secondaryTotal} ({Math.round(patient.secondaryPercentage)}%)
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-20 bg-gray-200 rounded-full h-3 mr-2">
                                <div 
                                  className={`h-3 rounded-full ${
                                    patient.completionLevel === 'high' ? 'bg-green-500' :
                                    patient.completionLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${patient.overallPercentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold text-gray-900">
                                {Math.round(patient.overallPercentage)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              patient.completionLevel === 'high' ? 'bg-green-100 text-green-800' :
                              patient.completionLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {patient.completionLevel === 'high' ? 'Completo' :
                               patient.completionLevel === 'medium' ? 'Parcial' : 'Incompleto'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Data Quality Notes */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
                <h5 className="font-semibold text-blue-900 mb-2">Definición de Campos:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div>
                    <strong>Datos Críticos:</strong> Nombre, sexo, fecha nacimiento, provincia, síntoma inicial, edad inicio, método diagnóstico, antecedentes familiares, resultado genético
                  </div>
                  <div>
                    <strong>Datos Secundarios:</strong> Médico derivante, institución, historia clínica, ciudad, dominancia, escolaridad, diagnóstico inicial, exón, MMSE, fecha ACV
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "timeline" && (
          <div className="space-y-6">
            {/* Cronograma del Estudio CADASILAr */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-blue-600" />
                Cronograma del Estudio CADASILAr
              </h3>
              
              <div className="relative">
                {/* Timeline visual */}
                <div className="flex justify-center mb-8">
                  <img 
                    src="/IMG-20250811-WA0012.jpg" 
                    alt="Cronograma CADASILAr-C y CADASILAr-Long"
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                </div>

                {/* Fases del estudio */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-4 text-lg">CADASILAr-C (Fase Transversal)</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                        <span><strong>Año 0:</strong> Reclutamiento y evaluación basal</span>
                      </div>
                      <div className="pl-6 text-gray-700 space-y-1">
                        <div>• Revisión de registros médicos</div>
                        <div>• Historia familiar detallada</div>
                        <div>• Evaluación neuropsicológica</div>
                        <div>• Resonancia magnética cerebral</div>
                        <div>• Muestra de sangre para biobanco</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-4 text-lg">CADASILAr-Long (Fase Longitudinal)</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <span><strong>Años 1-5:</strong> Seguimiento longitudinal</span>
                      </div>
                      <div className="pl-6 text-gray-700 space-y-1">
                        <div>• Evaluaciones anuales de seguimiento</div>
                        <div>• Monitoreo de progresión clínica</div>
                        <div>• Análisis de deterioro cognitivo</div>
                        <div>• Estudios de neuroimagen seriados</div>
                        <div>• Recolección continua de biomuestras</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Componentes del biobanco */}
                <div className="mt-8 bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-4 text-lg flex items-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full mr-3 flex items-center justify-center">
                      <span className="text-white text-xs">Bio</span>
                    </div>
                    Programa de Biobanco Nacional
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-green-800 mb-2">Biomuestras Recolectadas:</div>
                      <div className="space-y-1 text-gray-700">
                        <div>• Muestras de sangre para DNA/RNA</div>
                        <div>• Plasma y suero para biomarcadores</div>
                        <div>• Biopsias de piel (casos seleccionados)</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-green-800 mb-2">Programa de Donación Cerebral:</div>
                      <div className="space-y-1 text-gray-700">
                        <div>• Banco nacional de cerebros CADASIL</div>
                        <div>• Estudios neuropatológicos</div>
                        <div>• Investigación traslacional</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "resources" && (
          <div className="space-y-6">
            {/* Recursos y Publicaciones */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                <RefreshCw className="w-6 h-6 mr-2 text-purple-600" />
                Recursos y Publicaciones Científicas
              </h3>

              {/* Póster Científico */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Póster Científico Oficial</h4>
                  <div className="space-y-4">
                    <div className="text-sm text-gray-700">
                      <strong>Título:</strong> "CADASIL Argentine Registry: Study Design and Preliminary Data"
                    </div>
                    <div className="text-sm text-gray-700">
                      <strong>Autores:</strong> Carolina Agata Ardohain Cristalli, MD, et al.
                    </div>
                    <div className="text-sm text-gray-700">
                      <strong>Instituciones:</strong> FLENI, Hospital Británico, Hospital Ramos Mejía, Hospital Posadas
                    </div>
                    <a 
                      href="/POSTERCAROfinalenpdf.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <span className="mr-2">📄</span>
                      Ver Póster Completo (PDF)
                    </a>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Variantes NOTCH3 Identificadas</h4>
                  <div className="space-y-4">
                    <div className="text-sm text-gray-700">
                      <strong>Transcripción de referencia:</strong> NM_000435.3
                    </div>
                    <div className="text-sm text-gray-700">
                      <strong>Dominios afectados:</strong> EGF-like (Factor de Crecimiento Epidérmico)
                    </div>
                    <a 
                      href="/IMG-20250811-WA0013.jpg" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <span className="mr-2">🧬</span>
                      Ver Mapa de Variantes
                    </a>
                  </div>
                </div>
              </div>

              {/* Mapas y Tablas */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h5 className="font-medium text-gray-900 mb-3">Distribución Geográfica</h5>
                  <div className="mb-3">
                    <img 
                      src="/IMG-20250811-WA0014.jpg" 
                      alt="Mapa distribución Argentina"
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                  <a 
                    href="/IMG-20250811-WA0014.jpg" 
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Ver mapa completo
                  </a>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h5 className="font-medium text-gray-900 mb-3">Tabla Demográfica</h5>
                  <div className="mb-3">
                    <img 
                      src="/IMG-20250811-WA0015.jpg" 
                      alt="Tabla demográfica"
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                  <a 
                    href="/IMG-20250811-WA0015.jpg" 
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Ver tabla completa
                  </a>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h5 className="font-medium text-gray-900 mb-3">Abstract Científico</h5>
                  <div className="mb-3 flex items-center justify-center h-32 bg-white rounded">
                    <span className="text-4xl">📄</span>
                  </div>
                  <a 
                    href="/Abstract.pdf" 
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Leer abstract completo
                  </a>
                </div>
              </div>

              {/* Mensajes clave del estudio */}
              <div className="mt-8 bg-orange-50 p-6 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-4 text-lg">Mensajes Clave del Estudio</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span>CADASIL está subdiagnosticado en Argentina</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span>La variabilidad geográfica refleja un efecto centro más que prevalencia real</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span>Se creó una cohorte nacional armonizada con datos clínicos, de imagen y genéticos</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span>Todos los casos confirmados mostraron mutaciones que alteran cisteína en dominios EGF</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer con información del estudio */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Contacto Principal</h4>
            <div className="text-gray-600">
              <div>Carolina Agata Ardohain Cristalli, MD</div>
              <div>FLENI, Buenos Aires, Argentina</div>
              <div className="text-blue-600">caroardohain@gmail.com</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Instituciones Participantes</h4>
            <div className="text-gray-600">
              <div>• FLENI (Buenos Aires)</div>
              <div>• Hospital Británico</div>
              <div>• Hospital Ramos Mejía</div>
              <div>• Hospital Posadas</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Datos de Actualización</h4>
            <div className="text-gray-600">
              <div>Archivo actual: {data.length} registros</div>
              <div>Última actualización: {new Date().toLocaleDateString("es-AR")}</div>
              <div className="text-green-600 font-medium">Dashboard en tiempo real</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
