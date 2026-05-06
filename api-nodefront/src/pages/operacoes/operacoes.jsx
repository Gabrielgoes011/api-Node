import React, { useState, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineDelete, AiOutlineBarChart, AiOutlineAreaChart } from 'react-icons/ai';
import NovaOperacaoModal from './components/modalNovaOperacao';
import { BarChart, AreaChart } from '../../components/Charts';
import { useOperacoes } from '../../hooks/hooksOperacoes/useOperacoes';
import { DataCard } from '../../components/DataCard';

const CHART_KEYS   = ['Compra', 'Venda', 'Liquido'];
const CHART_COLORS = {
  Compra:  'linear-gradient(180deg,#4ade80 0%,#16a34a 100%)',
  Venda:   'linear-gradient(180deg,#f87171 0%,#dc2626 100%)',
  Liquido: 'linear-gradient(180deg,#60a5fa 0%,#2563eb 100%)',
};
const AREA_COLORS = { Compra: '#22c55e', Venda: '#ef4444', Liquido: '#3b82f6' };

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function PaginaOperacoes() {
  const [anoSelecionado, setAnoSelecionado] = useState('2026');
  const [mesSelecionado, setMesSelecionado] = useState('Todos');
  const [modalAberto, setModalAberto] = useState(false);
  const [tipoGrafico, setTipoGrafico] = useState('barras');
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [operacaoParaExcluir, setOperacaoParaExcluir] = useState(null);

  const {
    operacoes, chartData, loading,
    getOperacoes, getChartData,
    handleLancarOperacao, handleExcluirOperacao,
  } = useOperacoes();

  useEffect(() => {
    getOperacoes({ mes: mesSelecionado, ano: anoSelecionado });
    getChartData({ ano: anoSelecionado });
  }, [anoSelecionado, mesSelecionado]);

  const abrirModalExclusao = (operacao) => {
    setOperacaoParaExcluir(operacao);
    setModalExclusaoAberto(true);
  };

  const confirmarExclusao = async () => {
    if (!operacaoParaExcluir) return;
    await handleExcluirOperacao(operacaoParaExcluir.id, { ano: anoSelecionado, mes: mesSelecionado });
    setModalExclusaoAberto(false);
    setOperacaoParaExcluir(null);
  };

  // ── definição das colunas com render customizado ──
  const colunasOperacoes = [
    { titulo: 'Data',       acesso: 'data',      width: '10%' },
    {
      titulo: 'Operação', acesso: 'operacao', width: '10%', align: 'center',
      render: (val) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500, backgroundColor: val?.toUpperCase() === 'COMPRA' ? '#dcfce7' : '#fee2e2', color: val?.toUpperCase() === 'COMPRA' ? '#166534' : '#dc2626' }}>
          {val}
        </span>
      ),
    },
    { titulo: 'Ativo',      acesso: 'ativo',     width: '10%', render: (val) => <span style={{ fontWeight: 700, color: '#1e293b' }}>{val}</span> },
    {
      titulo: 'Seguimento', acesso: 'seguimento', width: '15%', align: 'center',
      render: (val) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500, backgroundColor: '#eff6ff', color: '#2563eb' }}>{val}</span>
        </div>
      ),
    },
    { titulo: 'Qtde',       acesso: 'qtde',      width: '8%',  align: 'center' },
    { titulo: 'Preço',      acesso: 'preco',     width: '12%', align: 'right',  render: (val) => fmt(val) },
    { titulo: 'Valor Total',acesso: 'valorTotal',width: '14%', align: 'right',  render: (val) => <span style={{ fontWeight: 600, color: '#1e293b' }}>{fmt(val)}</span> },
  ];

  // monta valorTotal em cada linha para o render
  const operacoesComTotal = operacoes.map(op => ({ ...op, valorTotal: op.qtde * op.preco }));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', color: '#334155', fontFamily: 'sans-serif' }}>
      
      <main style={{ maxWidth: '60rem', margin: '0 auto', padding: '1rem 0.5rem', marginTop: '0px' }}>
        
        {/* Seção do Gráfico */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Total de Compras Por Mês</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              
              {/* Toggle Tipo de Gráfico */}
              <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '0.5rem' }}>
                <button
                  onClick={() => setTipoGrafico('barras')}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 10px',
                    backgroundColor: tipoGrafico === 'barras' ? '#ffffff' : 'transparent',
                    color: tipoGrafico === 'barras' ? '#2563eb' : '#64748b',
                    borderRadius: '0.375rem', border: 'none', cursor: 'pointer',
                    boxShadow: tipoGrafico === 'barras' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s'
                  }}
                  title="Gráfico de Barras"
                >
                  <AiOutlineBarChart size={18} />
                </button>
                <button
                  onClick={() => setTipoGrafico('area')}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 10px',
                    backgroundColor: tipoGrafico === 'area' ? '#ffffff' : 'transparent',
                    color: tipoGrafico === 'area' ? '#2563eb' : '#64748b',
                    borderRadius: '0.375rem', border: 'none', cursor: 'pointer',
                    boxShadow: tipoGrafico === 'area' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s'
                  }}
                  title="Gráfico de Área"
                >
                  <AiOutlineAreaChart size={18} />
                </button>
              </div>
              
              {/* Divisória Vertical */}
              <div style={{ width: '1px', height: '24px', backgroundColor: '#cbd5e1', margin: '0 4px' }} />

              <label style={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>ANO</label>
              <div style={{ position: 'relative' }}>
                <select 
                  value={anoSelecionado}
                onChange={(e) => setAnoSelecionado(e.target.value)}
                  style={{ appearance: 'none', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', fontWeight: 600, padding: '0.5rem 0.75rem 0.5rem 1rem', paddingRight: '2.5rem', borderRadius: '0.375rem', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                  <option value="2030">2030</option>
                </select>
              </div>
            </div>
          </div>

          {tipoGrafico === 'barras' ? (
            <BarChart data={chartData} keys={CHART_KEYS} colors={CHART_COLORS} />
          ) : (
            <AreaChart data={chartData} keys={CHART_KEYS} colors={AREA_COLORS} />
          )}

          {/* Legenda */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem', fontSize: '14px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', background: 'linear-gradient(180deg, #4ade80 0%, #16a34a 100%)', borderRadius: '4px', boxShadow: '0 2px 4px rgba(74,222,128,0.3)' }} />
              <span>Compra</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', background: 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)', borderRadius: '4px', boxShadow: '0 2px 4px rgba(248,113,113,0.3)' }} />
              <span>Venda</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)', borderRadius: '4px', boxShadow: '0 2px 4px rgba(96,165,250,0.3)' }} />
              <span>Líquido</span>
            </div>
          </div>
        </div>

        {/* Tabela de Operações */}
        <DataCard
          titulo="Registro de Operações"
          botaoLabel="Nova Operação"
          onBotaoClick={() => setModalAberto(true)}
          labelpesquisa="Buscar operações..."
          filtros={
            <select
              value={mesSelecionado}
              onChange={e => setMesSelecionado(e.target.value)}
              style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', fontSize: '14px', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', outline: 'none', cursor: 'pointer' }}
            >
              <option value="Todos">Todos os meses</option>
              <option value="01">Janeiro</option>
              <option value="02">Fevereiro</option>
              <option value="03">Março</option>
              <option value="04">Abril</option>
              <option value="05">Maio</option>
              <option value="06">Junho</option>
              <option value="07">Julho</option>
              <option value="08">Agosto</option>
              <option value="09">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </select>
          }
          coluna={colunasOperacoes}
          data={loading ? [] : operacoesComTotal}
          itemsPerPage={10}
          usaExcluir
          acaoExcluir={abrirModalExclusao}
        />

      </main>
      
      <NovaOperacaoModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onSuccess={(payload) => handleLancarOperacao(payload, { ano: anoSelecionado, mes: mesSelecionado })}
      />
      
      {/* Modal de Confirmação de Exclusão */}
      {modalExclusaoAberto && operacaoParaExcluir && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(2px)' }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', width: '100%', maxWidth: '400px', fontFamily: 'sans-serif' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50', fontSize: '1.4rem', textAlign: 'center' }}>Excluir Operação</h3>
            <p style={{ margin: '0 0 20px 0', color: '#475569', fontSize: '1rem', textAlign: 'center' }}>
              Tem certeza que deseja excluir essa operação?
            </p>
            
            <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: '0 0 8px 0', color: '#334155' }}><strong>Ativo:</strong> {operacaoParaExcluir.ativo}</p>
              <p style={{ margin: '0 0 8px 0', color: '#334155' }}><strong>Quantidade:</strong> {operacaoParaExcluir.qtde}</p>
              <p style={{ margin: 0, color: '#334155' }}><strong>Total:</strong> {formatarMoeda(operacaoParaExcluir.qtde * operacaoParaExcluir.preco)}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => { setModalExclusaoAberto(false); setOperacaoParaExcluir(null); }}
                style={{ flex: 1, padding: '12px', backgroundColor: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#cbd5e1'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#e2e8f0'}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusao}
                style={{ flex: 1, padding: '12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
