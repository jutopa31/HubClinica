-- CADASILAR Patient Registry Schema
-- Run this in your Supabase SQL Editor

CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  record_id INTEGER,
  redcap_repeat_instrument TEXT,
  redcap_repeat_instance INTEGER,
  nombre_apellido TEXT,
  medico_derivante TEXT,
  institucion TEXT,
  historia_clinica TEXT,
  sexo INTEGER,
  provincia TEXT,
  ciudad TEXT,
  direccion_aproximada TEXT,
  fecha_nacimiento DATE,
  dominancia INTEGER,
  escolaridad INTEGER,
  antecedentes_familiares INTEGER,
  cad_confirmado_familia INTEGER,
  historia_acv_migrana INTEGER,
  sintoma_inicial INTEGER,
  sintoma_inicial_other TEXT,
  edad_inicio INTEGER,
  edad_ingresada INTEGER,
  diagnostico_inicial INTEGER,
  diagnostico_erroneo INTEGER,
  fecha_diagnostico_erroneo DATE,
  fallecio INTEGER,
  fecha_fallecimiento DATE,
  tiene_mmse_moca INTEGER,
  valor_mmse_moca1 INTEGER,
  fecha_mmse_moca1 DATE,
  valor_mmse_moca2 INTEGER,
  fecha_mmse_moca2 DATE,
  fecha_acv_1 DATE,
  fecha_acv_2 DATE,
  fecha_acv_3 DATE,
  fecha_acv_4 DATE,
  fecha_acv_5 DATE,
  toast_acv_1 TEXT,
  toast_acv_2 TEXT,
  toast_acv_3 TEXT,
  toast_acv_4 TEXT,
  toast_acv_5 TEXT,
  escala_nihss_1 INTEGER,
  escala_nihss_2 INTEGER,
  escala_nihss_3 INTEGER,
  escala_nihss_4 INTEGER,
  escala_nihss_5 INTEGER,
  mrs_1 INTEGER,
  mrs_2 INTEGER,
  mrs_3 INTEGER,
  mrs_4 INTEGER,
  mrs_5 INTEGER,
  tratamiento_recibido INTEGER,
  metodo_diagnostico INTEGER,
  tiene_resultado_de_estudio INTEGER,
  resultado_genetico TEXT,
  exon INTEGER,
  fecha_rmn DATE,
  link_rmn TEXT,
  usuario_rmn TEXT,
  temp_pole INTEGER,
  ext_capsule INTEGER,
  brainstem_microangiop INTEGER,
  superficial_atrophy INTEGER,
  deep_atrophy INTEGER,
  perivent_wmh INTEGER,
  deep_wmh INTEGER,
  superf_wmh INTEGER,
  dpvs_cso INTEGER,
  dpvs_bg INTEGER,
  lacunes INTEGER,
  large_infarct INTEGER,
  cmb INTEGER,
  macrobleeds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (adjust as needed)
CREATE POLICY "Allow all operations" ON patients FOR ALL USING (true);

-- Create an updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();