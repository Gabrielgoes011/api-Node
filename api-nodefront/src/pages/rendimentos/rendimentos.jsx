import React, { useState, useMemo, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineDelete } from 'react-icons/ai';
import { BarChart, AreaChart } from '../../components/Charts';
import NovoRendimentoModal from './components/modalNovoRendimento';
import { useRendimentos } from '../../hooks/hooksRendimentos/useRendimentos';
import { toastSuccess } from '../../utils/responseUtils';

// ─── constantes ────────────────────────────────────────────────────────────────
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const ANOS  = ['2023','2024','2025','2026'];

const CHART_KEYS   = ['Valor'];
const CHART_COLORS = { Valor: 'linear-gradient(180deg,#60a5fa 0%,#2563eb 100%)' };
const AREA_COLORS  = { Valor: '#3b82f6' };

const COR_ANOS = { '2023': '#f59e0b', '2024': '#ef4444', '2025': '#3b82f6', '2026': '#10b981' };

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

// ─── Gráfico Evolução Anual ────────────────────────────────────────────────────
function EvolucaoAnualChart({ data }) {
  const [animate, setAnimate] = React.useState(false);
  React.useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, [data]);

  const max = Math.max(...data.map(d => d.Valor || 0), 1);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '12px', padding: '8px 0 0' }}>
      {data.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '6px', whiteSpace: 'nowrap' }}>
            {fmt(item.Valor)}
          </span>
          <div style={{
            width: '100%', maxWidth: '56px',
            height: animate ? `${Math.max((item.Valor / max) * 160, item.Valor > 0 ? 4 : 0)}px` : '0px',
            background: 'linear-gradient(180deg,#60a5fa 0%,#2563eb 100%)',
            borderRadius: '6px 6px 0 0',
            boxShadow: '0 4px 6px -1px rgba(96,165,250,0.35)',
            transition: `height 0.7s cubic-bezier(0.34,1.56,0.64,1) ${idx * 0.08}s`,
            borderBottom: '2px solid #f1f5f9',
          }} title={`${item.name}: ${fmt(item.Valor)}`} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginTop: '8px' }}>
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Gráfico de barras horizontais agrupadas (Comparação Mensal) ───────────────
function BarChartHorizontal({ data, anos }) {
  const anosOrdenados = [...anos].sort((a, b) => Number(a) - Number(b));
  const max = Math.max(...data.flatMap(d => anosOrdenados.map(a => d[a] || 0)), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {MESES.map((mes, mi) => {
        const row = data.find(d => d.mes === mi + 1) || {};
        return (
          <div key={mi} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', width: '72px', textAlign: 'right', flexShrink: 0 }}>{mes.substring(0,3)}</span>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {anosOrdenados.map(ano => {
                const val = row[ano] || 0;
                return (
                  <div key={ano} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div
                      style={{ height: '10px', width: `${(val / max) * 100}%`, minWidth: val > 0 ? '4px' : '0', backgroundColor: COR_ANOS[ano], borderRadius: '0 3px 3px 0', transition: 'width 0.5s ease' }}
                      title={`${ano}: ${fmt(val)}`}
                    />
                    {val > 0 && <span style={{ fontSize: '9px', color: '#94a3b8' }}>{fmt(val)}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Página principal ──────────────────────────────────────────────────────────
export default function PaginaRendimentos() {
  const { rendimentos, loading, getRendimentos, detalheMensal, detalheAnual, loadingGrafico, getGrafico } = useRendimentos();

  const [filtroAtivo, setFiltroAtivo] = useState('Todos');
  const [filtroMes, setFiltroMes]     = useState('Todos');
  const [filtroAno, setFiltroAno]     = useState(String(new Date().getFullYear()));
  const [anoGrafico, setAnoGrafico]   = useState(String(new Date().getFullYear()));
  const [tipoGrafico, setTipoGrafico] = useState('barras');
  const [anosComp, setAnosComp]       = useState(['2024','2025','2026']);
  const [modalAberto, setModalAberto] = useState(false);
  const [abaAtiva, setAbaAtiva]       = useState('graficos');

  // Busca os dados sempre que ano ou mês do filtro mudar
  useEffect(() => {
    getRendimentos({ mes: filtroMes, ano: filtroAno });
  }, [filtroMes, filtroAno, getRendimentos]);

  // Busca dados do gráfico sempre que o ano do gráfico mudar
  useEffect(() => {
    getGrafico({ ano: anoGrafico });
  }, [anoGrafico, getGrafico]);

  const ativos = useMemo(() => ['Todos', ...new Set(rendimentos.map(d => d.ticker))], [rendimentos]);

  // Filtro por ativo (apenas no front, pois a API já filtra por mês/ano)
  const filtrados = useMemo(() => rendimentos.filter(d =>
    filtroAtivo === 'Todos' || d.ticker === filtroAtivo
  ), [rendimentos, filtroAtivo]);

  const totalRecebido  = useMemo(() => filtrados.reduce((s, d) => s + Number(d.valorRecebido), 0), [filtrados]);
  const totalAcumulado = useMemo(() => rendimentos.reduce((s, d) => s + Number(d.valorRecebido), 0), [rendimentos]);
  const yieldOnCost    = totalAcumulado > 0 ? ((totalRecebido / totalAcumulado) * 100).toFixed(2) : '0.00';

  // Gráfico mensal — dados reais da API (detalheMensal)
  const chartMensal = useMemo(() => MESES.map((nome, mi) => {
    const item = detalheMensal.find(d => parseInt(d.mes) === mi + 1);
    return { name: nome, Valor: item ? parseFloat(item.totalRendimento) || 0 : 0 };
  }), [detalheMensal]);

  // Evolução anual — dados reais da API (detalheAnual)
  const chartAnual = useMemo(() => ANOS.map(ano => {
    const item = detalheAnual.find(d => String(parseInt(d.ano)) === ano);
    return { name: ano, Valor: item ? parseFloat(item.totalRendimento) || 0 : 0 };
  }), [detalheAnual]);

  // Comparação mensal — ainda calculada no front pois precisa de múltiplos anos cruzados
  const chartComparacao = useMemo(() => MESES.map((_, mi) => {
    const row = { mes: mi + 1 };
    anosComp.forEach(ano => {
      row[ano] = rendimentos.filter(d => {
        const dt = new Date(d.dtRendimento);
        return dt.getUTCFullYear() === Number(ano)
            && dt.getUTCMonth() === mi
            && (filtroAtivo === 'Todos' || d.ticker === filtroAtivo);
      }).reduce((s, d) => s + Number(d.valorRecebido), 0);
    });
    return row;
  }), [rendimentos, anosComp, filtroAtivo]);

  const handleNovoRendimento = () => {
    toastSuccess('Rendimento lançado com sucesso!');
    setModalAberto(false);
    getRendimentos({ mes: filtroMes, ano: filtroAno });
    getGrafico({ ano: anoGrafico });
  };

  const toggleAnoComp = (ano) =>
    setAnosComp(prev => prev.includes(ano) ? prev.filter(a => a !== ano) : [...prev, ano]);

  const selectStyle = {
    backgroundColor: '#ffffff', border: '1px solid #cbd5e1', color: '#334155',
    fontSize: '14px', padding: '0.375rem 0.75rem', borderRadius: '0.375rem',
    outline: 'none', cursor: 'pointer', fontWeight: 600,
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', color: '#334155', fontFamily: 'sans-serif' }}>
      <main style={{ maxWidth: '60rem', margin: '0 auto', padding: '1rem 0.5rem', marginTop: '0px' }}>

        {/* ── KPIs + Filtros ── */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            {/* filtros */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              {[
                { label: 'ATIVO', value: filtroAtivo, set: setFiltroAtivo, options: ativos.map(a => ({ v: a, l: a })) },
                { label: 'MÊS',   value: filtroMes,   set: setFiltroMes,   options: [{ v:'Todos', l:'Todos' }, ...MESES.map((m,i) => ({ v: String(i+1).padStart(2,'0'), l: m }))] },
                { label: 'ANO',   value: filtroAno,   set: setFiltroAno,   options: ANOS.map(a => ({ v: a, l: a })) },
              ].map(({ label, value, set, options }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>{label}</span>
                  <select value={value} onChange={e => set(e.target.value)} style={selectStyle}>
                    {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                </div>
              ))}
            </div>
            {/* KPIs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.75rem', padding: '0.75rem 1.25rem', minWidth: '148px' }}>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#16a34a' }}>TOTAL RECEBIDO</p>
                <p style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 700, color: '#15803d' }}>{fmt(totalRecebido)}</p>
              </div>
              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.75rem', padding: '0.75rem 1.25rem', minWidth: '148px' }}>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#2563eb' }}>YIELD ON COST</p>
                <p style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 700, color: '#1d4ed8' }}>{yieldOnCost}%</p>
              </div>
              <div style={{ backgroundColor: '#fefce8', border: '1px solid #fde68a', borderRadius: '0.75rem', padding: '0.75rem 1.25rem', minWidth: '148px' }}>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#d97706' }}>TOTAL ACUMULADO</p>
                <p style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 700, color: '#b45309' }}>{fmt(totalAcumulado)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Abas ── */}
        <nav style={{ display: 'flex', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '1.5rem' }}>
          {[
            { id: 'graficos',  label: '📊 Gráficos'  },
            { id: 'historico', label: '📋 Histórico'  },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setAbaAtiva(id)}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                backgroundColor: abaAtiva === id ? '#ffffff' : '#f8fafc',
                color: abaAtiva === id ? '#1d4ed8' : '#64748b',
                border: 'none',
                borderBottom: abaAtiva === id ? '3px solid #1d4ed8' : '3px solid transparent',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* ── Loading ── */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '14px' }}>
            Carregando rendimentos...
          </div>
        )}

        {/* ── Aba Gráficos ── */}
        {!loading && abaAtiva === 'graficos' && (<>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Total de Rendimentos por Mês</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '0.5rem' }}>
                  {['barras','area'].map(tipo => (
                    <button
                      key={tipo}
                      onClick={() => setTipoGrafico(tipo)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 10px',
                        backgroundColor: tipoGrafico === tipo ? '#ffffff' : 'transparent',
                        color: tipoGrafico === tipo ? '#2563eb' : '#64748b',
                        borderRadius: '0.375rem', border: 'none', cursor: 'pointer',
                        boxShadow: tipoGrafico === tipo ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        transition: 'all 0.2s', fontSize: '12px', fontWeight: 600,
                      }}
                    >
                      {tipo === 'barras' ? '▊ Barras' : '〜 Área'}
                    </button>
                  ))}
                </div>
                <div style={{ width: '1px', height: '24px', backgroundColor: '#cbd5e1' }} />
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>ANO</span>
                <select value={anoGrafico} onChange={e => setAnoGrafico(e.target.value)} style={{ ...selectStyle, appearance: 'none', paddingRight: '2rem' }}>
                  {ANOS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>

            {tipoGrafico === 'barras'
              ? <BarChart  data={chartMensal} keys={CHART_KEYS} colors={CHART_COLORS} />
              : <AreaChart data={chartMensal} keys={CHART_KEYS} colors={AREA_COLORS}  />
            }

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', background: 'linear-gradient(180deg,#60a5fa 0%,#2563eb 100%)', borderRadius: '4px' }} />
                <span>Rendimento</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Evolução Anual */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
              <h2 style={{ margin: '0 0 1.5rem', fontSize: '17px', fontWeight: 700, color: '#1e293b' }}>Evolução Anual Rendimentos</h2>
              <EvolucaoAnualChart data={chartAnual} />
            </div>

            {/* Comparação Mensal */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#1e293b' }}>Comparação por Meses e Anos</h2>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {ANOS.map(ano => (
                    <button
                      key={ano}
                      onClick={() => toggleAnoComp(ano)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '3px 8px', borderRadius: '9999px', border: '1px solid',
                        borderColor: anosComp.includes(ano) ? COR_ANOS[ano] : '#cbd5e1',
                        backgroundColor: anosComp.includes(ano) ? COR_ANOS[ano] + '22' : 'transparent',
                        color: anosComp.includes(ano) ? COR_ANOS[ano] : '#94a3b8',
                        fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                      }}
                    >
                      <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: anosComp.includes(ano) ? COR_ANOS[ano] : '#cbd5e1', display: 'inline-block' }} />
                      {ano}
                    </button>
                  ))}
                </div>
              </div>
              <BarChartHorizontal data={chartComparacao} anos={anosComp} />
            </div>
          </div>
        </>)}

        {/* ── Aba Histórico ── */}
        {!loading && abaAtiva === 'historico' && (<>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Histórico de Rendimentos</h2>
                <select
                  value={filtroMes}
                  onChange={e => setFiltroMes(e.target.value)}
                  style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', fontSize: '14px', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="Todos">Todos os meses</option>
                  {MESES.map((m, i) => (
                    <option key={i} value={String(i + 1).padStart(2, '0')}>{m}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setModalAberto(true)}
                style={{ backgroundColor: '#2563eb', color: '#ffffff', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#2563eb'}
              >
                <AiOutlinePlus size={18} />
                Novo Rendimento
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#dbeafe', color: '#334155', fontSize: '14px', borderBottom: '2px solid #93c5fd' }}>
                    <th style={{ padding: '1rem', fontWeight: 600 }}>Data</th>
                    <th style={{ padding: '1rem', fontWeight: 600 }}>Ativo</th>
                    <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Segmento</th>
                    <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Valor Recebido</th>
                    <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '14px' }}>
                  {filtrados.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                        Nenhum rendimento encontrado para os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filtrados.map((row, index) => (
                      <tr
                        key={row.id}
                        style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafbfc', transition: 'background-color 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#fafbfc'}
                      >
                        <td style={{ padding: '1rem', fontWeight: 500, color: '#334155' }}>
                          {new Date(row.dtRendimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                        </td>
                        <td style={{ padding: '1rem', fontWeight: 700, color: '#1e293b' }}>{row.ticker}</td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500, backgroundColor: '#eff6ff', color: '#2563eb' }}>
                              {row.nomeSeguimento}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 700, color: '#15803d' }}>
                          {fmt(Number(row.valorRecebido))}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <button
                            style={{ color: '#cbd5e1', cursor: 'pointer', padding: '0.375rem', borderRadius: '0.375rem', backgroundColor: 'transparent', border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                            onMouseOver={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = '#fee2e2'; }}
                            onMouseOut={e => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                            title="Excluir rendimento"
                          >
                            <AiOutlineDelete size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
              Os dados são fornecidos para fins informativos. Simulação de ambiente Web.
            </div>
          </div>
        </>)}

      </main>

      <NovoRendimentoModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onSuccess={handleNovoRendimento}
        ativos={ativos.filter(a => a !== 'Todos')}
      />
    </div>
  );
}
