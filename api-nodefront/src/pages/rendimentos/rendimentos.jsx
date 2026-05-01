import React, { useState, useMemo } from 'react';
import { AiOutlinePlus, AiOutlineDelete } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BarChart, AreaChart } from '../../components/Charts';
import NovoRendimentoModal from './components/modalNovoRendimento';

// ─── constantes ────────────────────────────────────────────────────────────────
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const ANOS  = ['2023','2024','2025','2026'];

// chave única para o BarChart de rendimentos (uma série só)
const CHART_KEYS   = ['Valor'];
const CHART_COLORS = { Valor: 'linear-gradient(180deg,#60a5fa 0%,#2563eb 100%)' };
const AREA_COLORS  = { Valor: '#3b82f6' };

// cores para comparação de anos
const COR_ANOS = { '2023': '#f59e0b', '2024': '#ef4444', '2025': '#3b82f6', '2026': '#10b981' };

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

// ─── dados mock ────────────────────────────────────────────────────────────────
const MOCK = [
  { id:1,  data:'2023-01-15', ativo:'MXRF11', segmento:'Papel',        valor:45.20 },
  { id:2,  data:'2023-01-15', ativo:'HGRU11', segmento:'Renda Urbana', valor:38.50 },
  { id:3,  data:'2023-02-15', ativo:'MXRF11', segmento:'Papel',        valor:46.80 },
  { id:4,  data:'2023-02-15', ativo:'XPML11', segmento:'Shoppings',    valor:32.10 },
  { id:5,  data:'2023-03-15', ativo:'MXRF11', segmento:'Papel',        valor:47.30 },
  { id:6,  data:'2023-03-15', ativo:'HGRU11', segmento:'Renda Urbana', valor:39.20 },
  { id:7,  data:'2023-03-15', ativo:'BRCO11', segmento:'Logística',    valor:28.90 },
  { id:8,  data:'2024-01-15', ativo:'MXRF11', segmento:'Papel',        valor:52.40 },
  { id:9,  data:'2024-01-15', ativo:'HGRU11', segmento:'Renda Urbana', valor:44.60 },
  { id:10, data:'2024-02-15', ativo:'XPML11', segmento:'Shoppings',    valor:38.70 },
  { id:11, data:'2024-02-15', ativo:'BRCO11', segmento:'Logística',    valor:33.50 },
  { id:12, data:'2024-03-15', ativo:'MXRF11', segmento:'Papel',        valor:53.80 },
  { id:13, data:'2024-04-15', ativo:'HGRU11', segmento:'Renda Urbana', valor:45.90 },
  { id:14, data:'2024-05-15', ativo:'XPML11', segmento:'Shoppings',    valor:40.20 },
  { id:15, data:'2024-06-15', ativo:'BRCO11', segmento:'Logística',    valor:35.10 },
  { id:16, data:'2024-07-15', ativo:'MXRF11', segmento:'Papel',        valor:55.30 },
  { id:17, data:'2024-08-15', ativo:'HGRU11', segmento:'Renda Urbana', valor:47.20 },
  { id:18, data:'2024-09-15', ativo:'XPML11', segmento:'Shoppings',    valor:41.80 },
  { id:19, data:'2024-10-15', ativo:'BRCO11', segmento:'Logística',    valor:36.40 },
  { id:20, data:'2024-11-15', ativo:'MXRF11', segmento:'Papel',        valor:56.70 },
  { id:21, data:'2024-12-15', ativo:'HGRU11', segmento:'Renda Urbana', valor:48.90 },
  { id:22, data:'2025-01-15', ativo:'MXRF11', segmento:'Papel',        valor:60.10 },
  { id:23, data:'2025-01-15', ativo:'HGRU11', segmento:'Renda Urbana', valor:51.30 },
  { id:24, data:'2025-02-15', ativo:'XPML11', segmento:'Shoppings',    valor:44.50 },
  { id:25, data:'2025-02-15', ativo:'BRCO11', segmento:'Logística',    valor:38.20 },
  { id:26, data:'2025-03-15', ativo:'MXRF11', segmento:'Papel',        valor:61.80 },
  { id:27, data:'2025-03-15', ativo:'HGRU11', segmento:'Renda Urbana', valor:52.70 },
  { id:28, data:'2025-04-15', ativo:'XPML11', segmento:'Shoppings',    valor:45.90 },
  { id:29, data:'2025-05-15', ativo:'BRCO11', segmento:'Logística',    valor:39.60 },
  { id:30, data:'2025-06-15', ativo:'MXRF11', segmento:'Papel',        valor:63.20 },
  { id:31, data:'2025-07-15', ativo:'HGRU11', segmento:'Renda Urbana', valor:54.10 },
  { id:32, data:'2025-08-15', ativo:'XPML11', segmento:'Shoppings',    valor:47.30 },
  { id:33, data:'2025-09-15', ativo:'BRCO11', segmento:'Logística',    valor:41.00 },
  { id:34, data:'2025-10-15', ativo:'MXRF11', segmento:'Papel',        valor:64.50 },
  { id:35, data:'2025-11-15', ativo:'HGRU11', segmento:'Renda Urbana', valor:55.40 },
  { id:36, data:'2025-12-15', ativo:'XPML11', segmento:'Shoppings',    valor:48.70 },
  { id:37, data:'2026-01-15', ativo:'MXRF11', segmento:'Papel',        valor:68.30 },
  { id:38, data:'2026-01-15', ativo:'HGRU11', segmento:'Renda Urbana', valor:57.20 },
  { id:39, data:'2026-02-15', ativo:'XPML11', segmento:'Shoppings',    valor:50.10 },
  { id:40, data:'2026-02-15', ativo:'BRCO11', segmento:'Logística',    valor:43.50 },
  { id:41, data:'2026-03-15', ativo:'MXRF11', segmento:'Papel',        valor:69.80 },
  { id:42, data:'2026-04-15', ativo:'HGRU11', segmento:'Renda Urbana', valor:58.60 },
];

// ─── Gráfico de barras horizontais agrupadas (Comparação Mensal) ───────────────
function BarChartHorizontal({ data, anos }) {
  const max = Math.max(...data.flatMap(d => anos.map(a => d[a] || 0)), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {MESES.map((mes, mi) => {
        const row = data.find(d => d.mes === mi + 1) || {};
        return (
          <div key={mi} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', width: '72px', textAlign: 'right', flexShrink: 0 }}>{mes.substring(0,3)}</span>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {anos.map(ano => {
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
  const [dados, setDados]             = useState(MOCK);
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');
  const [filtroMes, setFiltroMes]     = useState('Todos');
  const [filtroAno, setFiltroAno]     = useState('Todos');
  const [anoGrafico, setAnoGrafico]   = useState('2026');
  const [tipoGrafico, setTipoGrafico] = useState('barras');
  const [anosComp, setAnosComp]       = useState(['2024','2025','2026']);
  const [modalAberto, setModalAberto] = useState(false);

  const ativos = useMemo(() => ['Todos', ...new Set(dados.map(d => d.ativo))], [dados]);

  // ── filtrados para KPIs e tabela ──
  const filtrados = useMemo(() => dados.filter(d => {
    const dt  = new Date(d.data);
    const mes = String(dt.getUTCMonth() + 1).padStart(2, '0');
    const ano = String(dt.getUTCFullYear());
    return (filtroAtivo === 'Todos' || d.ativo === filtroAtivo)
        && (filtroMes   === 'Todos' || mes === filtroMes)
        && (filtroAno   === 'Todos' || ano === filtroAno);
  }), [dados, filtroAtivo, filtroMes, filtroAno]);

  const totalRecebido  = useMemo(() => filtrados.reduce((s, d) => s + d.valor, 0), [filtrados]);
  const totalAcumulado = useMemo(() => dados.reduce((s, d) => s + d.valor, 0), [dados]);
  const yieldOnCost    = totalAcumulado > 0 ? ((totalRecebido / totalAcumulado) * 100).toFixed(2) : '0.00';

  // ── dados para gráfico mensal (mesmo formato de operacoes: { name, Valor }) ──
  const chartMensal = useMemo(() => MESES.map((nome, mi) => ({
    name: nome,
    Valor: dados.filter(d => {
      const dt = new Date(d.data);
      return dt.getUTCFullYear() === Number(anoGrafico)
          && dt.getUTCMonth() === mi
          && (filtroAtivo === 'Todos' || d.ativo === filtroAtivo);
    }).reduce((s, d) => s + d.valor, 0),
  })), [dados, anoGrafico, filtroAtivo]);

  // ── dados para evolução anual ──
  const chartAnual = useMemo(() => ANOS.map(ano => ({
    name: ano,
    Valor: dados.filter(d =>
      String(new Date(d.data).getUTCFullYear()) === ano
      && (filtroAtivo === 'Todos' || d.ativo === filtroAtivo)
    ).reduce((s, d) => s + d.valor, 0),
  })), [dados, filtroAtivo]);

  // ── dados para comparação mensal ──
  const chartComparacao = useMemo(() => MESES.map((_, mi) => {
    const row = { mes: mi + 1 };
    anosComp.forEach(ano => {
      row[ano] = dados.filter(d => {
        const dt = new Date(d.data);
        return dt.getUTCFullYear() === Number(ano)
            && dt.getUTCMonth() === mi
            && (filtroAtivo === 'Todos' || d.ativo === filtroAtivo);
      }).reduce((s, d) => s + d.valor, 0);
    });
    return row;
  }), [dados, anosComp, filtroAtivo]);

  const handleNovoRendimento = (novo) => {
    setDados(prev => [...prev, { ...novo, id: prev.length + 1 }]);
    toast.success('Rendimento lançado com sucesso!');
    setModalAberto(false);
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
                { label: 'ANO',   value: filtroAno,   set: setFiltroAno,   options: [{ v:'Todos', l:'Todos' }, ...ANOS.map(a => ({ v: a, l: a }))] },
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

        {/* ── Gráfico mensal — mesmo layout do card de operações ── */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Total de Rendimentos por Mês</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* toggle barras / área */}
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

          {/* legenda */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem', fontSize: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', background: 'linear-gradient(180deg,#60a5fa 0%,#2563eb 100%)', borderRadius: '4px' }} />
              <span>Rendimento</span>
            </div>
          </div>
        </div>

        {/* ── Evolução Anual + Comparação Mensal — mesmo grid 2 colunas ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

          {/* Evolução Anual */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
            <h2 style={{ margin: '0 0 1.25rem', fontSize: '17px', fontWeight: 700, color: '#1e293b' }}>Evolução Anual Rendimentos</h2>
            <BarChart data={chartAnual} keys={CHART_KEYS} colors={CHART_COLORS} />
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

        {/* ── Tabela — mesmo padrão de operações ── */}
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
                    <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
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
                        {new Date(row.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#1e293b' }}>{row.ativo}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500, backgroundColor: '#eff6ff', color: '#2563eb' }}>
                            {row.segmento}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 700, color: '#15803d' }}>{fmt(row.valor)}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <button
                          onClick={() => setDados(prev => prev.filter(d => d.id !== row.id))}
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

      </main>

      <NovoRendimentoModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onSuccess={handleNovoRendimento}
        ativos={ativos.filter(a => a !== 'Todos')}
      />
      <ToastContainer />
    </div>
  );
}
