import { useState } from 'react';
import { supabase } from './supabaseClient';

const BLOCOS = [
  {
    key: 'b1', num: '1', alerta: true,
    titulo: 'Postura no Acolhimento e Acesso ao Médico',
    descricao: 'Avalia a forma como a secretária recebe e direciona o paciente, considerando cordialidade, empatia e facilitação do acesso ao médico. Este bloco está diretamente relacionado às reclamações recebidas e deve ser preenchido com base em situações observadas ou relatadas.',
    aviso: 'O papel da secretária é facilitar o acesso ao médico, não filtrar ou barrar pacientes.',
    indicadores: [
      'Recebe o paciente com cordialidade, independentemente do perfil ou complexidade do caso',
      'Facilita o acesso à consulta sem criar barreiras desnecessárias ou exigências não previstas pelo médico',
      'Mantém tom respeitoso e empático mesmo diante de pacientes ansiosos, exigentes ou em sofrimento',
      'Retorna contatos do paciente (ligações, mensagens e e-mails) dentro do prazo esperado e sem necessidade de cobrança',
    ],
  },
  {
    key: 'b2', num: '2', alerta: false,
    titulo: 'Comunicação com o Paciente',
    descricao: 'Avalia a qualidade e clareza das informações transmitidas ao paciente sobre o procedimento cirúrgico, preparo e orientações pré-operatórias.',
    indicadores: [
      'Informa o paciente com clareza sobre etapas, preparo e cuidados antes da cirurgia',
      'Registra e repassa ao médico as dúvidas e preocupações relatadas pelo paciente',
      'Demonstra segurança ao abordar perguntas sobre procedimentos, sem ultrapassar os limites do seu papel',
    ],
  },
  {
    key: 'b3', num: '3', alerta: false,
    titulo: 'Organização e Agendamento Cirúrgico',
    descricao: 'Avalia a capacidade de organizar os procedimentos cirúrgicos junto aos hospitais credenciados, garantindo que todas as etapas estejam confirmadas antes da data da cirurgia.',
    indicadores: [
      'Organiza e confirma os agendamentos nos hospitais credenciados dentro dos prazos necessários',
      'Verifica e controla a documentação exigida pelos hospitais antes de cada procedimento',
      'Antecipa pendências e comunica o médico sobre riscos de atraso ou cancelamento',
    ],
  },
  {
    key: 'b4', num: '4', alerta: false,
    titulo: 'Acompanhamento Pós-Operatório',
    descricao: 'Avalia a proatividade no contato com o paciente após a cirurgia, garantindo orientações adequadas e comunicação ágil de intercorrências ao médico.',
    indicadores: [
      'Realiza o contato pós-operatório com o paciente dentro do prazo definido pelo médico',
      'Identifica sinais de alerta relatados pelo paciente e aciona o médico de forma tempestiva',
      'Orienta o paciente sobre retorno, curativos e cuidados conforme protocolo do médico',
    ],
  },
  {
    key: 'b5', num: '5', alerta: false,
    titulo: 'Comunicação com Hospitais e Equipe',
    descricao: 'Avalia a qualidade da interface com os hospitais credenciados e com a equipe médica, garantindo fluxos ágeis e informações precisas.',
    indicadores: [
      'Mantém contato claro e objetivo com os setores hospitalares responsáveis pelo agendamento',
      'Repassa informações ao médico de forma precisa, sem omissões ou distorções',
      'Registra ocorrências e comunicações relevantes de forma organizada e acessível',
    ],
  },
];

const CONCEITOS = [
  { valor: 'NA', label: 'Não Atende', cor: '#D9534F' },
  { valor: 'AP', label: 'Atende Parcialmente', cor: '#E8A838' },
  { valor: 'AT', label: 'Atende', cor: '#5BA85A' },
  { valor: 'SU', label: 'Supera', cor: '#2E75B6' },
];

export default function Questionario() {
  const [form, setForm] = useState({ colaboradora: '', avaliador: '', data: '', periodo: '' });
  const [respostas, setRespostas] = useState({});
  const [obs, setObs] = useState({});
  const [analise, setAnalise] = useState({ fortes: '', desenvolv: '', situacoes: '', expectativas: '' });
  const [erros, setErros] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const totalGrupos = BLOCOS.reduce((acc, b) => acc + b.indicadores.length, 0);
  const marcados = Object.keys(respostas).length;
  const progresso = Math.min(100, Math.round((marcados / totalGrupos) * 100));

  const setResposta = (blocoKey, idx, valor) => {
    setRespostas(prev => ({ ...prev, [`${blocoKey}_${idx}`]: valor }));
  };

  const enviar = async () => {
    const novosErros = {};
    ['colaboradora', 'avaliador', 'data', 'periodo'].forEach(k => {
      if (!form[k].trim()) novosErros[k] = true;
    });
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      alert('Preencha todos os campos de identificação.');
      return;
    }

    setSalvando(true);
    setErro('');

    const payload = {
      colaboradora: form.colaboradora,
      avaliador: form.avaliador,
      data_avaliacao: form.data,
      periodo_avaliado: form.periodo,
      // Bloco 1
      b1_i1: respostas['b1_0'] || null,
      b1_i2: respostas['b1_1'] || null,
      b1_i3: respostas['b1_2'] || null,
      b1_i4: respostas['b1_3'] || null,
      b1_obs: obs['b1'] || null,
      // Bloco 2
      b2_i1: respostas['b2_0'] || null,
      b2_i2: respostas['b2_1'] || null,
      b2_i3: respostas['b2_2'] || null,
      b2_obs: obs['b2'] || null,
      // Bloco 3
      b3_i1: respostas['b3_0'] || null,
      b3_i2: respostas['b3_1'] || null,
      b3_i3: respostas['b3_2'] || null,
      b3_obs: obs['b3'] || null,
      // Bloco 4
      b4_i1: respostas['b4_0'] || null,
      b4_i2: respostas['b4_1'] || null,
      b4_i3: respostas['b4_2'] || null,
      b4_obs: obs['b4'] || null,
      // Bloco 5
      b5_i1: respostas['b5_0'] || null,
      b5_i2: respostas['b5_1'] || null,
      b5_i3: respostas['b5_2'] || null,
      b5_obs: obs['b5'] || null,
      // Análise geral
      analise_fortes: analise.fortes || null,
      analise_desenvolv: analise.desenvolv || null,
      analise_situacoes: analise.situacoes || null,
      analise_expectativas: analise.expectativas || null,
    };

    const { error } = await supabase.from('avaliacoes_secretaria').insert([payload]);

    if (error) {
      console.error(error);
      setErro('Erro ao salvar. Tente novamente.');
      setSalvando(false);
      return;
    }

    setSalvando(false);
    setEnviado(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (enviado) return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <Header />
      <div style={st.container}>
        <div style={{ ...st.card, textAlign: 'center', padding: '56px 32px' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: 14 }}>✅</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", color: '#1A3C5E', fontSize: '1.5rem', marginBottom: 8 }}>Avaliação registrada com sucesso</h2>
          <p style={{ color: '#666', fontSize: '.88rem', lineHeight: 1.6, maxWidth: 400, margin: '0 auto' }}>Obrigado pelo preenchimento. As informações serão analisadas pela Genthe e utilizadas na construção do Plano de Desenvolvimento Individual da colaboradora.</p>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <header style={{ ...st.header, position: 'relative' }}>
        <div><div style={st.logoNome}>Genthe</div><div style={st.logoTag}>RH e Desenvolvimento Organizacional</div></div>
        <div style={st.badge}>Avaliação 90°</div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 3, background: 'rgba(255,255,255,.15)' }}>
          <div style={{ height: 3, background: '#2E75B6', width: `${progresso}%`, transition: 'width .4s ease' }} />
        </div>
      </header>

      <div style={st.hero}>
        <h1 style={st.heroH1}>Avaliação de Desempenho 90°</h1>
        <p style={st.heroP}>Secretária de Neurocirurgião — Avaliação do Líder sobre a Colaboradora</p>
      </div>

      <div style={st.container}>

        <div style={{ ...st.card, borderTop: '4px solid #2E75B6' }}>
          <h2 style={{ ...st.secH2(false), marginBottom: 20 }}>Identificação</h2>
          <div style={st.grid2}>
            {[['colaboradora','Nome da Colaboradora','Nome completo'],['avaliador','Avaliador (Líder)','Nome completo'],['data','Data da Avaliação','dd/mm/aaaa'],['periodo','Período Avaliado','Ex: janeiro a junho/2026']].map(([key, label, ph]) => (
              <div key={key} style={{ marginBottom: 4 }}>
                <label style={st.label}>{label} *</label>
                <input
                  style={{ ...st.input, borderColor: erros[key] ? '#D9534F' : '#E8E8E8' }}
                  placeholder={ph}
                  value={form[key]}
                  onChange={e => { setForm(p => ({ ...p, [key]: e.target.value })); setErros(p => ({ ...p, [key]: false })); }}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={st.card}>
          <h2 style={{ ...st.secH2(false), marginBottom: 18 }}>Legenda dos Conceitos</h2>
          <div style={st.legenda}>
            {CONCEITOS.map(c => (
              <div key={c.valor} style={{ background: c.cor, borderRadius: 8, padding: '12px 8px', textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '.68rem', textTransform: 'uppercase', letterSpacing: .5, color: '#fff', marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: '.67rem', color: 'rgba(255,255,255,.85)', lineHeight: 1.3 }}>
                  {c.valor === 'NA' ? 'Comportamento ausente ou abaixo do esperado' : c.valor === 'AP' ? 'Demonstra o comportamento, mas de forma inconsistente' : c.valor === 'AT' ? 'Comportamento presente de forma consistente' : 'Excede o esperado, serve de referência para a equipe'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {BLOCOS.map(bloco => (
          <div key={bloco.key} style={st.card}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
              <div style={{ background: bloco.alerta ? '#E8A838' : '#1A3C5E', color: '#fff', fontWeight: 700, fontSize: '.8rem', borderRadius: 8, padding: '4px 10px', whiteSpace: 'nowrap', marginTop: 2, flexShrink: 0 }}>{bloco.num}</div>
              <div>
                <h2 style={st.secH2(bloco.alerta)}>{bloco.titulo}</h2>
                <p style={{ fontSize: '.82rem', color: '#666', lineHeight: 1.55 }}>{bloco.descricao}</p>
              </div>
            </div>
            {bloco.aviso && (
              <div style={{ background: '#FFF8EC', borderLeft: '4px solid #E8A838', borderRadius: '0 8px 8px 0', padding: '10px 14px', margin: '12px 0 18px', fontSize: '.8rem', color: '#7D5000', fontStyle: 'italic' }}>
                <strong style={{ fontStyle: 'normal', display: 'block', marginBottom: 2 }}>Atenção</strong>{bloco.aviso}
              </div>
            )}
            <div style={{ border: '1px solid #E8E8E8', borderRadius: 10, overflow: 'hidden', marginTop: 14 }}>
              {bloco.indicadores.map((ind, idx) => {
                const chave = `${bloco.key}_${idx}`;
                const marcado = respostas[chave];
                return (
                  <div key={idx} style={{ borderBottom: idx < bloco.indicadores.length - 1 ? '1px solid #E8E8E8' : 'none' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '14px 16px', gap: 14, background: marcado ? '#EAF3FB' : idx % 2 !== 0 ? '#F5F5F5' : '#fff' }}>
                      <div style={{ fontSize: '.85rem', color: '#2D2D2D', lineHeight: 1.5 }}>{ind}</div>
                      <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
                        {CONCEITOS.map(c => (
                          <button key={c.valor} title={c.label} onClick={() => setResposta(bloco.key, idx, c.valor)}
                            style={{ width: 36, height: 36, borderRadius: 7, border: marcado === c.valor ? 'none' : `2px solid ${c.cor}55`, background: marcado === c.valor ? c.cor : 'transparent', color: marcado === c.valor ? '#fff' : c.cor, fontWeight: 700, fontSize: '.58rem', textTransform: 'uppercase', cursor: 'pointer', transition: 'all .18s', letterSpacing: .3 }}
                          >{c.valor}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div style={{ background: '#fafafa', borderTop: '1px dashed #E8E8E8', padding: '12px 16px' }}>
                <label style={{ fontSize: '.75rem', color: '#666', fontStyle: 'italic', fontWeight: 500, display: 'block', marginBottom: 5 }}>Observações (opcional):</label>
                <textarea style={{ width: '100%', border: '1px solid #E8E8E8', borderRadius: 7, padding: '9px 11px', fontFamily: "'Inter',sans-serif", fontSize: '.82rem', resize: 'vertical', minHeight: 60, outline: 'none' }}
                  placeholder="Descreva comportamentos observados ou relatados..."
                  value={obs[bloco.key] || ''}
                  onChange={e => setObs(p => ({ ...p, [bloco.key]: e.target.value }))}
                />
              </div>
            </div>
          </div>
        ))}

        <div style={st.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
            <div style={{ background: '#1A3C5E', color: '#fff', fontWeight: 700, fontSize: '.8rem', borderRadius: 8, padding: '4px 10px', flexShrink: 0 }}>6</div>
            <h2 style={st.secH2(false)}>Análise Geral</h2>
          </div>
          {[['fortes','Principais pontos fortes observados no período','Descreva os pontos positivos...'],['desenvolv','Principais pontos de desenvolvimento identificados','Descreva o que precisa melhorar...'],['situacoes','Situações específicas que motivaram esta avaliação','Relate com base em fatos observados...'],['expectativas','Expectativas do líder para o próximo período','O que espera da colaboradora daqui em diante...']].map(([key, label, ph]) => (
            <div key={key} style={{ marginBottom: 18 }}>
              <label style={st.label}>{label}</label>
              <textarea style={{ ...st.input, minHeight: 85, resize: 'vertical' }} placeholder={ph} value={analise[key]} onChange={e => setAnalise(p => ({ ...p, [key]: e.target.value }))} />
            </div>
          ))}
        </div>

        {erro && <div style={{ background: '#fde8e8', border: '1px solid #D9534F', borderRadius: 8, padding: '12px 16px', color: '#D9534F', fontSize: '.85rem', marginBottom: 16, textAlign: 'center' }}>{erro}</div>}

        <button onClick={enviar} disabled={salvando}
          style={{ background: '#1A3C5E', color: '#fff', border: 'none', borderRadius: 10, padding: '15px 44px', fontFamily: "'Inter',sans-serif", fontSize: '.95rem', fontWeight: 600, cursor: salvando ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(26,60,94,.25)', display: 'block', margin: '32px auto 0', opacity: salvando ? .7 : 1 }}
        >{salvando ? 'Salvando...' : 'Concluir Avaliação'}</button>

      </div>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header style={st.header}>
      <div><div style={st.logoNome}>Genthe</div><div style={st.logoTag}>RH e Desenvolvimento Organizacional</div></div>
      <div style={st.badge}>Avaliação 90°</div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ background: '#1A3C5E', textAlign: 'center', padding: 18, color: 'rgba(255,255,255,.45)', fontSize: '.72rem', letterSpacing: .4, marginTop: 40 }}>
      Genthe RH e Desenvolvimento Organizacional &nbsp;•&nbsp; Campo Grande, MS<br />
      <span style={{ color: 'rgba(255,255,255,.65)', fontStyle: 'italic' }}>Gente que Seleciona, Desenvolve, Integra e Valoriza.</span>
    </footer>
  );
}

const st = {
  header: { background: '#1A3C5E', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(0,0,0,.18)' },
  logoNome: { fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: '1.2rem' },
  logoTag: { color: 'rgba(255,255,255,.5)', fontSize: '.68rem', letterSpacing: '1px', textTransform: 'uppercase', marginTop: 2 },
  badge: { background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.22)', borderRadius: 20, padding: '5px 14px', color: 'rgba(255,255,255,.85)', fontSize: '.72rem', fontWeight: 500 },
  hero: { background: 'linear-gradient(135deg,#1A3C5E 0%,#1d4d7a 100%)', padding: '48px 40px 40px', textAlign: 'center' },
  heroH1: { fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: '1.8rem', marginBottom: 8 },
  heroP: { color: 'rgba(255,255,255,.7)', fontSize: '.9rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 },
  container: { maxWidth: 820, margin: '0 auto', padding: '36px 20px 80px' },
  card: { background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px rgba(0,0,0,.07)', padding: 32, marginBottom: 24 },
  secH2: (alerta) => ({ fontSize: '1rem', fontWeight: 700, color: alerta ? '#E8A838' : '#1A3C5E', marginBottom: 4 }),
  legenda: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  label: { fontSize: '.8rem', fontWeight: 600, color: '#1A3C5E', display: 'block', marginBottom: 7 },
  input: { width: '100%', border: '1.5px solid #E8E8E8', borderRadius: 8, padding: '10px 13px', fontFamily: "'Inter',sans-serif", fontSize: '.85rem', color: '#2D2D2D', outline: 'none', background: '#F5F5F5', display: 'block' },
};
