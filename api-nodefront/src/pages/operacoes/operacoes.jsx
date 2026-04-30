import React, { useState, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineDelete, AiOutlineBarChart, AiOutlineAreaChart } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NovaOperacaoModal from './components/modalNovaOperacao';
import API_BASE_URL from '../../config/api';

const SimpleBarChart = ({ data }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => setAnimate(true), 100); // Pequeno atraso para a animação engatilhar
    return () => clearTimeout(timer);
  }, [data]);

  if (!data || data.length === 0) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#94a3b8' }}>Nenhum dado disponível</div>;
  }

  const maxValue = Math.max(...data.map(item => Math.max(item.Compra, item.Venda, item.Liquido))) || 1;
  
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', flex: 1, gap: '4px', overflowX: 'auto', padding: '15px 5px' }}>
      {data.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 0', minWidth: '40px' }}>
          {/* Barras */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '160px', width: '100%', justifyContent: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '4px' }}>
            {/* Compra */}
            <div style={{ width: '28%', maxWidth: '12px', height: animate ? `${(item.Compra / maxValue) * 150}px` : '0px', background: 'linear-gradient(180deg, #4ade80 0%, #16a34a 100%)', borderRadius: '4px 4px 0 0', boxShadow: '0 4px 6px -1px rgba(74, 222, 128, 0.4)', transition: `height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.05}s` }} title={`Compra: R$ ${item.Compra.toFixed(2)}`} />
            {/* Venda */}
            <div style={{ width: '28%', maxWidth: '12px', height: animate ? `${(item.Venda / maxValue) * 150}px` : '0px', background: 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)', borderRadius: '4px 4px 0 0', boxShadow: '0 4px 6px -1px rgba(248, 113, 113, 0.4)', transition: `height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.05 + 0.1}s` }} title={`Venda: R$ ${item.Venda.toFixed(2)}`} />
            {/* Líquido */}
            <div style={{ width: '28%', maxWidth: '12px', height: animate ? `${(Math.max(0, item.Liquido) / maxValue) * 150}px` : '0px', background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)', borderRadius: '4px 4px 0 0', boxShadow: '0 4px 6px -1px rgba(96, 165, 250, 0.4)', transition: `height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.05 + 0.2}s` }} title={`Líquido: R$ ${item.Liquido.toFixed(2)}`} />
          </div>
          {/* Label */}
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginTop: '8px', margin: '8px 0 0 0' }}>{item.name.substring(0,3)}</p>
        </div>
      ))}
    </div>
  );
};

const SmoothAreaChart = ({ data }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, [data]);

  if (!data || data.length === 0) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#94a3b8' }}>Nenhum dado disponível</div>;
  }

  const maxValue = Math.max(...data.map(item => Math.max(item.Compra, item.Venda, item.Liquido))) || 1;
  
  // Configurações do SVG
  const height = 160;
  const width = 1200; // Largura virtual para distribuir os meses uniformemente
  
  // Funções matemáticas para mapear os dados para as coordenadas do SVG
  const getX = (i) => (i * (width / data.length)) + (width / data.length / 2);
  const getY = (val) => height - (Math.max(0, val) / maxValue) * (height - 30) - 15; // 15px de margem superior e inferior

  // Gerador de curvas suaves (Bezier)
  const makePath = (key) => {
    let path = `M ${getX(0)},${getY(data[0][key])}`;
    for (let i = 1; i < data.length; i++) {
      const x0 = getX(i - 1);
      const y0 = getY(data[i - 1][key]);
      const x1 = getX(i);
      const y1 = getY(data[i][key]);
      const cx = (x0 + x1) / 2; // Ponto de controle para suavizar
      path += ` C ${cx},${y0} ${cx},${y1} ${x1},${y1}`;
    }
    return path;
  };

  const pathCompra = makePath('Compra');
  const pathVenda = makePath('Venda');
  const pathLiquido = makePath('Liquido');

  return (
    <div style={{ position: 'relative', width: '100%', padding: '15px 5px 35px 5px', overflowX: 'auto' }}>
      <div style={{ position: 'relative', width: '100%', minWidth: '600px', height: `${height}px` }}>
        
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            {/* Gradientes */}
            <linearGradient id="gradCompraArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="gradVendaArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f87171" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="gradLiquidoArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.0" />
            </linearGradient>
            
            {/* Máscara de corte para animação de desenho da esquerda pra direita */}
            <clipPath id="wipe-clip-area">
              <rect x="0" y="-20" height="200" width={animate ? "100%" : "0%"} style={{ transition: 'width 1.2s cubic-bezier(0.25, 1, 0.5, 1)' }} />
            </clipPath>
          </defs>

          <g clipPath="url(#wipe-clip-area)">
            {/* Preenchimentos de Área */}
            <path d={`${pathCompra} L ${getX(data.length - 1)},${height} L ${getX(0)},${height} Z`} fill="url(#gradCompraArea)" />
            <path d={`${pathVenda} L ${getX(data.length - 1)},${height} L ${getX(0)},${height} Z`} fill="url(#gradVendaArea)" />
            <path d={`${pathLiquido} L ${getX(data.length - 1)},${height} L ${getX(0)},${height} Z`} fill="url(#gradLiquidoArea)" />
            
            {/* Linhas principais */}
            <path d={pathCompra} fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d={pathVenda} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d={pathLiquido} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Pontos nas linhas (com tooltip nativo) */}
            {data.map((d, i) => (
              <g key={`pts-${i}`}>
                <circle cx={getX(i)} cy={getY(d.Compra)} r="4" fill="#ffffff" stroke="#16a34a" strokeWidth="2.5" style={{ cursor: 'pointer' }}><title>Compra: R$ {d.Compra.toFixed(2)}</title></circle>
                <circle cx={getX(i)} cy={getY(d.Venda)} r="4" fill="#ffffff" stroke="#dc2626" strokeWidth="2.5" style={{ cursor: 'pointer' }}><title>Venda: R$ {d.Venda.toFixed(2)}</title></circle>
                <circle cx={getX(i)} cy={getY(d.Liquido)} r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" style={{ cursor: 'pointer' }}><title>Líquido: R$ {d.Liquido.toFixed(2)}</title></circle>
              </g>
            ))}
          </g>
        </svg>
        
        {/* Rótulos de texto dos Meses sobrepondo o gráfico perfeitamente na base */}
        <div style={{ display: 'flex', position: 'absolute', bottom: '-30px', left: 0, width: '100%', borderTop: '2px solid #f1f5f9', paddingTop: '8px' }}>
          {data.map((item, idx) => (
            <div key={idx} style={{ flex: '1 1 0', textAlign: 'center' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', margin: 0 }}>{item.name.substring(0,3)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function PaginaOperacoes() {
  const [anoSelecionado, setAnoSelecionado] = useState('2026');
  const [mesSelecionado, setMesSelecionado] = useState('Todos');
  const [operacoes, setOperacoes] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [tipoGrafico, setTipoGrafico] = useState('barras'); // 'barras' ou 'area'
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [operacaoParaExcluir, setOperacaoParaExcluir] = useState(null);

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  // Função para recarregar os dados
  const recarregarDados = () => {
    // Recarregar operações
    const fetchOperacoes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/operacoes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mes: mesSelecionado,
            ano: anoSelecionado
          })
        });

        if (response.ok) {
          const data = await response.json();
          
          // Formatando os dados retornados pelo backend
          const operacoesFormatadas = data.map((op, index) => {
            const dt = new Date(op.dataOperacao);
            return {
              id: op.id || index, // usa o index como fallback caso não haja id
              data: dt.toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
              operacao: op.tipo,
              ativo: op.ticker,
              seguimento: op.nomeSeguimento,
              qtde: op.quantidade,
              preco: op.preco
            };
          });
          
          setOperacoes(operacoesFormatadas);
        } else {
          console.error('Erro ao buscar operações da API');
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    };

    // Recarregar dados do gráfico
    const fetchChartData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/carregaDadosGraficoOperacoes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ano: anoSelecionado
          })
        });

        if (response.ok) {
          const data = await response.json();

          // Inicializa todos os meses com zero para manter a linha do gráfico contínua
          const mesesIniciais = monthNames.map(nome => ({
            name: nome, Compra: 0, Venda: 0, Liquido: 0
          }));

          // Preenche apenas os meses que voltaram valores da API
          data.forEach(item => {
            const mesIndex = parseInt(item.mes, 10) - 1; // A API retorna mês de 1 a 12 (ex: Jan = 1)
            if (mesIndex >= 0 && mesIndex < 12) {
              mesesIniciais[mesIndex].Compra = parseFloat(item.totalComprado) || 0;
              mesesIniciais[mesIndex].Venda = parseFloat(item.totalVendido) || 0;
              mesesIniciais[mesIndex].Liquido = parseFloat(item.totalLiquido) || 0;
            }
          });

          setChartData(mesesIniciais);
        } else {
          console.error('Erro ao buscar dados do gráfico');
        }
      } catch (error) {
        console.error('Erro na requisição do gráfico:', error);
      }
    };

    fetchOperacoes();
    fetchChartData();
  };

  useEffect(() => {
    recarregarDados();
  }, [anoSelecionado, mesSelecionado]);

  // Formatador de moeda para Real
  const formatarMoeda = (valor) => {
    const formatador = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    return formatador.format(valor);
  };

  const abrirModalExclusao = (operacao) => {
    setOperacaoParaExcluir(operacao);
    setModalExclusaoAberto(true);
  };

  const confirmarExclusao = async () => {
    if (!operacaoParaExcluir) return;

    try {
      const response = await fetch(`${API_BASE_URL}/excluirOperacao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: operacaoParaExcluir.id })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Operação excluída com sucesso!');
        recarregarDados(); // Atualiza a tabela e os gráficos automaticamente
      } else {
        toast.error(`Erro: ${data.error} ${data.errorDetails ? '- ' + data.errorDetails : ''}`);
      }
    } catch (error) {
      console.error('Erro na requisição de exclusão:', error);
      toast.error('Erro de conexão ao tentar excluir a operação.');
    } finally {
      setModalExclusaoAberto(false);
      setOperacaoParaExcluir(null);
    }
  };

  // O backend já retorna os dados filtrados por mês e ano
  const operacoesFiltradas = operacoes;

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
            <SimpleBarChart data={chartData} />
          ) : (
            <SmoothAreaChart data={chartData} />
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
        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Registro de Operações</h2>
              <select 
                value={mesSelecionado}
                onChange={(e) => setMesSelecionado(e.target.value)}
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
            </div>
            
            <button 
              onClick={() => setModalAberto(true)}
              style={{ backgroundColor: '#2563eb', color: '#ffffff', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} 
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}>
              <AiOutlinePlus size={18} />
              Nova Operação
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#dbeafe', color: '#334155', fontSize: '14px', borderBottom: '2px solid #93c5fd' }}>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Data</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Operação</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Ativo</th>
                  <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Seguimento</th>
                  <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Quantidade</th>
                  <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Preço</th>
                  <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Valor Total</th>
                  <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Ações</th>

                </tr>
              </thead>
              <tbody style={{ fontSize: '14px' }}>
                {operacoesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                      Nenhuma operação encontrada para este período.
                    </td>
                  </tr>
                ) : (
                  operacoesFiltradas.map((row, index) => {
                    const valorTotal = row.qtde * row.preco;
                    return (
                      <tr 
                        key={row.id} 
                        style={{ 
                          borderBottom: '1px solid #e2e8f0', 
                          backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafbfc',
                          transition: 'background-color 0.2s'
                        }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = (index % 2 === 0 ? '#ffffff' : '#fafbfc')}
                      >
                        <td style={{ padding: '1rem', fontWeight: 500, color: '#334155' }}>{row.data}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            paddingLeft: '0.625rem', 
                            paddingRight: '0.625rem', 
                            paddingTop: '0.25rem', 
                            paddingBottom: '0.25rem', 
                            borderRadius: '9999px', 
                            fontSize: '12px', 
                            fontWeight: 500, 
                            backgroundColor: row.operacao.toUpperCase() === 'COMPRA' ? '#dcfce7' : '#fee2e2',
                            color: row.operacao.toUpperCase() === 'COMPRA' ? '#166534' : '#dc2626'
                          }}>
                            {row.operacao}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', fontWeight: 700, color: '#1e293b' }}>{row.ativo}</td>
                        <td style={{ padding: '1rem', color: '#475569', textAlign: 'center' }}>{row.seguimento}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#475569' }}>{row.qtde}</td>
                        <td style={{ padding: '1rem', textAlign: 'right', color: '#475569' }}>{formatarMoeda(row.preco)}</td>
                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#1e293b' }}>
                          {formatarMoeda(valorTotal)}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <button 
                          onClick={() => abrirModalExclusao(row)}
                            style={{ color: '#cbd5e1', cursor: 'pointer', padding: '0.375rem', borderRadius: '0.375rem', backgroundColor: 'transparent', border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                          onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = '#fee2e2'; }}
                          onMouseOut={(e) => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                            title="Excluir operação"
                          >
                            <AiOutlineDelete size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
            Os dados são fornecidos para fins informativos. Simulação de ambiente Web.
          </div>
        </div>

      </main>
      
      <NovaOperacaoModal isOpen={modalAberto} onClose={() => setModalAberto(false)} onSuccess={() => { toast.success('Operação cadastrada com sucesso!'); recarregarDados(); }} />
      
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

      <ToastContainer />
    </div>
  );
}
