import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD;

const BLOCOS = [
  { key: 'b1', titulo: '1. Postura no Acolhimento e Acesso ao Médico', alerta: true,
    campos: ['b1_i1','b1_i2','b1_i3','b1_i4'],
    indicadores: ['Recebe o paciente com cordialidade','Facilita o acesso sem criar barreiras desnecessárias','Mantém tom respeitoso e empático','Retorna contatos dentro do prazo esperado'] },
  { key: 'b2', titulo: '2. Comunicação com o Paciente', alerta: false,
    campos: ['b2_i1','b2_i2','b2_i3'],
    indicadores: ['Informa o paciente com clareza sobre a cirurgia','Registra e repassa dúvidas ao médico','Demonstra segurança sem ultrapassar os limites do papel'] },
  { key: 'b3', titulo: '3. Organização e Agendamento Cirúrgico', alerta: false,
    campos: ['b3_i1','b3_i2','b3_i3'],
    indicadores: ['Organiza e confirma agendamentos nos hospitais','Verifica e controla a documentação antes dos procedimentos','Antecipa pendências e comunica o médico'] },
  { key: 'b4', titulo: '4. Acompanhamento Pós-Operatório', alerta: false,
    campos: ['b4_i1','b4_i2','b4_i3'],
    indicadores: ['Realiza contato pós-operatório dentro do prazo','Identifica sinais de alerta e aciona o médico','Orienta sobre retorno e cuidados conforme protocolo'] },
  { key: 'b5', titulo: '5. Comunicação com Hospitais e Equipe', alerta: false,
    campos: ['b5_i1','b5_i2','b5_i3'],
    indicadores: ['Mantém contato claro com os setores hospitalares','Repassa informações ao médico sem omissões','Registra ocorrências de forma organizada'] },
];

const CONCEITO_LABEL = { NA: 'Não Atende', AP: 'Atende Parcialmente', AT: 'Atende', SU: 'Supera' };
const CONCEITO_COR = { NA: '#D9534F', AP: '#E8A838', AT: '#5BA85A', SU: '#2E75B6' };

function calcStats(lista) {
  let at = 0, ap = 0, na = 0;
  lista.forEach(aval => {
    BLOCOS.forEach(b => {
      b.campos.forEach(campo => {
        const v = aval[campo];
        if (v === 'AT' || v === 'SU') at++;
        else if (v === 'AP') ap++;
        else if (v === 'NA') na++;
      });
    });
  });
  return { at, ap, na };
}

export default function AdminPanel() {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [abertos, setAbertos] = useState({});

  const autenticar = () => {
    if (senha === ADMIN_PASSWORD) {
      setAutenticado(true);
      setErroSenha('');
    } else {
      setErroSenha('Senha incorreta.');
    }
  };

  useEffect(() => {
    if (!autenticado) return;
    setCarregando(true);
    supabase
      .from('avaliacoes_secretaria')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setLista(data || []);
        setCarregando(false);
      });
  }, [autenticado]);

  const toggle = (id) => setAbertos(p => ({ ...p, [id]: !p[id] }));

  const { at, ap, na } = calcStats(lista);

  if (!autenticado) return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', flexDirection: 'column' }}>
      <header style={st.header}>
        <div><div style={st.logoNome}>Genthe</div><div style={st.logoTag}>RH e Desenvolvimento Organizacional</div></div>
        <div style={st.badge}>Painel Administrativo</div>
      </header>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,.1)', padding: '48px 40px', width: '100%', maxWidth: 380, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>🔒</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", color: '#1A3C5E', fontSize: '1.3rem', marginBottom: 6 }}>Acesso Restrito</h2>
          <p style={{ color: '#666', fontSize: '.85rem', marginBottom: 28 }}>Digite a senha para acessar o painel.</p>
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && autenticar()}
            style={{ width: '100%', border: `1.5px solid ${erroSenha ? '#D9534F' : '#E8E8E8'}`, borderRadius: 8, padding: '11px 14px', fontFamily: "'Inter',sans-serif", fontSize: '.9rem', outline: 'none', marginBottom: 8 }}
          />
          {erroSenha && <p style={{ color: '#D9534F', fontSize: '.8rem', marginBottom: 8 }}>{erroSenha}</p>}
          <button onClick={autenticar}
            style={{ width: '100%', background: '#1A3C5E', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontFamily: "'Inter',sans-serif", fontSize: '.9rem', fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>
            Entrar
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <header style={st.header}>
        <div><div style={st.logoNome}>Genthe</div><div style={st.logoTag}>RH e Desenvolvimento Organizacional</div></div>
        <div style={st.badge}>Painel Administrativo</div>
      </header>

      <div style={{ background: 'linear-gradient(135deg,#1A3C5E 0%,#1d4d7a 100%)', padding: '32px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: '1.5rem', marginBottom: 4 }}>Avaliações Recebidas — 90°</h1>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '.85rem' }}>Secretária de Neurocirurgião</p>
        </div>
        <a href="/" style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.3)', borderRadius: 8, padding: '8px 16px', color: '#fff', fontFamily: "'Inter',sans-serif", fontSize: '.82rem', fontWeight: 500, textDecoration: 'none' }}>← Ir ao Questionário</a>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 20px 80px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
          {[['#2E75B6', lista.length, 'Avaliações'], ['#5BA85A', at, 'Atende / Supera'], ['#E8A838', ap, 'Atende Parcialmente'], ['#D9534F', na, 'Não Atende']].map(([cor, num, label]) => (
            <div key={label} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,.06)', padding: 20, textAlign: 'center', borderTop: `3px solid ${cor}` }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.2rem', color: cor, fontWeight: 700, marginBottom: 4 }}>{num}</div>
              <div style={{ fontSize: '.72rem', color: '#666', textTransform: 'uppercase', letterSpacing: .5 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1A3C5E' }}>Respostas Registradas</h2>
        </div>

        {carregando ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#666' }}>Carregando avaliações...</div>
        ) : lista.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 14, padding: '60px 32px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📋</div>
            <h3 style={{ color: '#1A3C5E', fontSize: '1rem', marginBottom: 6 }}>Nenhuma avaliação registrada ainda</h3>
            <p style={{ color: '#666', fontSize: '.85rem', lineHeight: 1.6, maxWidth: 340, margin: '0 auto' }}>Quando o médico preencher o questionário, as respostas aparecerão aqui automaticamente.</p>
          </div>
        ) : lista.map(aval => {
          const aberto = abertos[aval.id];
          return (
            <div key={aval.id} style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 14px rgba(0,0,0,.07)', marginBottom: 18, overflow: 'hidden', border: '1px solid #E8E8E8' }}>
              <div style={{ background: '#1A3C5E', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '.95rem' }}>{aval.colaboradora}</div>
                  <div style={{ color: 'rgba(255,255,255,.65)', fontSize: '.78rem', marginTop: 2 }}>Avaliado por: {aval.avaliador}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[`📅 ${aval.data_avaliacao}`, `📆 ${aval.periodo_avaliado}`, `🕐 ${new Date(aval.created_at).toLocaleString('pt-BR')}`].map(t => (
                    <div key={t} style={{ background: 'rgba(255,255,255,.15)', borderRadius: 6, padding: '3px 10px', color: 'rgba(255,255,255,.85)', fontSize: '.72rem', fontWeight: 500 }}>{t}</div>
                  ))}
                </div>
              </div>

              {aberto && (
                <div style={{ padding: '22px 24px' }}>
                  {BLOCOS.map(b => (
                    <div key={b.key} style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: '.78rem', fontWeight: 700, color: b.alerta ? '#E8A838' : '#1A3C5E', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 10, paddingBottom: 6, borderBottom: `2px solid ${b.alerta ? '#FFF3CD' : '#EAF3FB'}` }}>{b.titulo}</div>
                      {b.indicadores.map((ind, idx) => {
                        const v = aval[b.campos[idx]];
                        return (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, fontSize: '.82rem', padding: '7px 0', borderBottom: '1px solid #F5F5F5' }}>
                            <div style={{ color: '#2D2D2D', flex: 1, lineHeight: 1.4 }}>{ind}</div>
                            <span style={{ padding: '3px 10px', borderRadius: 5, fontSize: '.7rem', fontWeight: 700, color: '#fff', background: v ? CONCEITO_COR[v] : '#ddd', whiteSpace: 'nowrap', minWidth: 120, textAlign: 'center' }}>{v ? CONCEITO_LABEL[v] : '—'}</span>
                          </div>
                        );
                      })}
                      {aval[`${b.key}_obs`] && (
                        <div style={{ marginTop: 8, background: '#F5F5F5', borderRadius: 7, padding: '9px 12px', fontSize: '.8rem', color: '#666', fontStyle: 'italic', lineHeight: 1.5 }}>
                          <strong style={{ fontStyle: 'normal', fontSize: '.75rem', display: 'block', marginBottom: 3 }}>Observações:</strong>{aval[`${b.key}_obs`]}
                        </div>
                      )}
                    </div>
                  ))}

                  {(aval.analise_fortes || aval.analise_desenvolv || aval.analise_situacoes || aval.analise_expectativas) && (
                    <div>
                      <div style={{ fontSize: '.78rem', fontWeight: 700, color: '#1A3C5E', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 10, paddingBottom: 6, borderBottom: '2px solid #EAF3FB' }}>6. Análise Geral</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {[['analise_fortes','Pontos Fortes'],['analise_desenvolv','Pontos de Desenvolvimento'],['analise_situacoes','Situações que Motivaram a Avaliação'],['analise_expectativas','Expectativas para o Próximo Período']].map(([campo, label]) => aval[campo] ? (
                          <div key={campo} style={{ background: '#F5F5F5', borderRadius: 8, padding: '12px 14px' }}>
                            <label style={{ fontSize: '.72rem', fontWeight: 700, color: '#1A3C5E', textTransform: 'uppercase', letterSpacing: .4, display: 'block', marginBottom: 5 }}>{label}</label>
                            <p style={{ fontSize: '.82rem', color: '#2D2D2D', lineHeight: 1.5 }}>{aval[campo]}</p>
                          </div>
                        ) : null)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button onClick={() => toggle(aval.id)}
                style={{ background: 'none', border: '1.5px solid #E8E8E8', borderRadius: 8, padding: '7px 16px', fontFamily: "'Inter',sans-serif", fontSize: '.78rem', color: '#666', cursor: 'pointer', margin: '0 24px 16px' }}>
                {aberto ? 'Recolher ↑' : 'Ver respostas completas ↓'}
              </button>
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
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
};
