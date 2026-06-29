-- Execute este SQL no Supabase > SQL Editor

CREATE TABLE avaliacoes_secretaria (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),

  -- Identificação
  colaboradora text,
  avaliador text,
  data_avaliacao text,
  periodo_avaliado text,

  -- Bloco 1: Postura no Acolhimento
  b1_i1 text,
  b1_i2 text,
  b1_i3 text,
  b1_i4 text,
  b1_obs text,

  -- Bloco 2: Comunicação com o Paciente
  b2_i1 text,
  b2_i2 text,
  b2_i3 text,
  b2_obs text,

  -- Bloco 3: Organização e Agendamento Cirúrgico
  b3_i1 text,
  b3_i2 text,
  b3_i3 text,
  b3_obs text,

  -- Bloco 4: Acompanhamento Pós-Operatório
  b4_i1 text,
  b4_i2 text,
  b4_i3 text,
  b4_obs text,

  -- Bloco 5: Comunicação com Hospitais e Equipe
  b5_i1 text,
  b5_i2 text,
  b5_i3 text,
  b5_obs text,

  -- Análise Geral
  analise_fortes text,
  analise_desenvolv text,
  analise_situacoes text,
  analise_expectativas text
);

-- Habilitar RLS
ALTER TABLE avaliacoes_secretaria ENABLE ROW LEVEL SECURITY;

-- Permitir INSERT público (para o questionário salvar)
CREATE POLICY "permitir insert publico"
ON avaliacoes_secretaria FOR INSERT
TO anon
WITH CHECK (true);

-- Permitir SELECT público (para o painel admin ler)
CREATE POLICY "permitir select publico"
ON avaliacoes_secretaria FOR SELECT
TO anon
USING (true);
