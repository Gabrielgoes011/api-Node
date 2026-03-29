import React, { useState } from 'react';
import { AiOutlineWarning, AiOutlinePlus, AiOutlineDelete } from 'react-icons/ai';

const SimpleBarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(item => Math.max(item.Compra, item.Venda, item.Liquido))) || 1500;
  
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '320px', gap: '8px', overflowX: 'auto', padding: '20px 0' }}>
      {data.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto', minWidth: '80px' }}>
          {/* Barras */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '250px' }}>
            {/* Compra */}
            <div style={{ width: '20px', height: `${(item.Compra / maxValue) * 250}px`, backgroundColor: '#4ade80', borderRadius: '4px 4px 0 0' }} title={`Compra: R$ ${item.Compra.toFixed(2)}`} />
            {/* Venda */}
            <div style={{ width: '20px', height: `${(item.Venda / maxValue) * 250}px`, backgroundColor: '#ef4444', borderRadius: '4px 4px 0 0' }} title={`Venda: R$ ${item.Venda.toFixed(2)}`} />
            {/* Líquido */}
            <div style={{ width: '20px', height: `${(item.Liquido / maxValue) * 250}px`, backgroundColor: '#3b82f6', borderRadius: '4px 4px 0 0' }} title={`Líquido: R$ ${item.Liquido.toFixed(2)}`} />
          </div>
          {/* Label */}
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginTop: '12px', margin: '12px 0 0 0' }}>{item.name}</p>
        </div>
      ))}
    </div>
  );
};

// Dados simulados baseados na imagem
const chartData = [
  { name: 'Jan', Compra: 1164.25, Venda: 0, Liquido: 1164.25 },
  { name: 'Fev', Compra: 0, Venda: 0, Liquido: 0 },
  { name: 'Mar', Compra: 0, Venda: 0, Liquido: 0 },
  { name: 'Abr', Compra: 0, Venda: 0, Liquido: 0 },
  { name: 'Mai', Compra: 0, Venda: 0, Liquido: 0 },
  { name: 'Jun', Compra: 0, Venda: 0, Liquido: 0 },
  { name: 'Jul', Compra: 0, Venda: 0, Liquido: 0 },
  { name: 'Ago', Compra: 0, Venda: 0, Liquido: 0 },
  { name: 'Set', Compra: 0, Venda: 0, Liquido: 0 },
  { name: 'Out', Compra: 0, Venda: 0, Liquido: 0 },
  { name: 'Nov', Compra: 0, Venda: 0, Liquido: 0 },
  { name: 'Dez', Compra: 0, Venda: 0, Liquido: 0 },
  { name: 'Total', Compra: 1164.25, Venda: 0, Liquido: 1164.25 },
];

const initialOperacoesData = [
  { id: 1, data: '17/02/2023', operacao: 'Compra', ativo: 'MXRF11', qtde: 1, preco: 10.12 },
  { id: 2, data: '13/03/2023', operacao: 'Compra', ativo: 'MXRF11', qtde: 4, preco: 10.24 },
  { id: 3, data: '14/03/2023', operacao: 'Compra', ativo: 'HGRU11', qtde: 1, preco: 115.59 },
  { id: 4, data: '14/03/2023', operacao: 'Compra', ativo: 'BTCI11', qtde: 3, preco: 8.86 },
  { id: 5, data: '24/03/2023', operacao: 'Compra', ativo: 'XPML11', qtde: 1, preco: 96.15 },
  { id: 6, data: '24/03/2023', operacao: 'Compra', ativo: 'MXRF11', qtde: 1, preco: 10.32 },
  { id: 7, data: '04/04/2023', operacao: 'Compra', ativo: 'MXRF11', qtde: 4, preco: 10.32 },
  { id: 8, data: '04/04/2023', operacao: 'Compra', ativo: 'HGRU11', qtde: 1, preco: 115.31 },
  { id: 9, data: '04/04/2023', operacao: 'Compra', ativo: 'BTCI11', qtde: 2, preco: 9.02 },
  { id: 10, data: '12/04/2023', operacao: 'Compra', ativo: 'BTCI11', qtde: 3, preco: 9.09 },
  { id: 11, data: '28/04/2023', operacao: 'Compra', ativo: 'VGIR11', qtde: 1, preco: 9.15 },
];

export default function PaginaOperacoes() {
  const [anoSelecionado, setAnoSelecionado] = useState('2023');
  const [mesSelecionado, setMesSelecionado] = useState('Todos');
  const [operacoes, setOperacoes] = useState(initialOperacoesData);

  // Formatador de moeda para Real
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const excluirOperacao = (id) => {
    setOperacoes(operacoes.filter(op => op.id !== id));
  };

  const operacoesFiltradas = operacoes.filter(op => {
    const [dia, mes, ano] = op.data.split('/');
    const anoMatch = ano === anoSelecionado;
    const mesMatch = mesSelecionado === 'Todos' || mes === mesSelecionado;
    return anoMatch && mesMatch;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', color: '#334155', fontFamily: 'sans-serif' }}>
      
      <main style={{ maxWidth: '60rem', margin: '0 auto', padding: '1rem 0.5rem', marginTop: '0px' }}>
        
        {/* Alerta de Instruções */}
        <div style={{ backgroundColor: '#fef3c7', borderLeft: '4px solid #f59e0b', padding: '1rem', borderRadius: '0 0.375rem 0.375rem 0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <AiOutlineWarning style={{ width: '24px', height: '24px', color: '#f59e0b', marginRight: '12px', marginTop: '4px', flexShrink: 0 }} />
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#92400e', margin: 0 }}>Instruções de uso</h3>
            <p style={{ fontSize: '14px', color: '#b45309', marginTop: '4px', margin: 0 }}>A primeira inserção de um ativo <strong>precisa ser uma compra</strong>. O sistema validará isso automaticamente.</p>
          </div>
        </div>

        {/* Seção do Gráfico */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Total de Compras Por Mês</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>ANO</label>
              <div style={{ position: 'relative' }}>
                <select 
                  value={anoSelecionado}
                  onChange={(e) => setAnoSelecionado(e.target.value)}
                  style={{ appearance: 'none', backgroundColor: '#fed7aa', border: '1px solid #fbcfe8', color: '#92400e', fontWeight: 600, padding: '0.5rem 0.75rem 0.5rem 1rem', paddingRight: '2.5rem', borderRadius: '0.375rem', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>
            </div>
          </div>

          <SimpleBarChart data={chartData} />

          {/* Legenda */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem', fontSize: '14px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', backgroundColor: '#4ade80', borderRadius: '2px' }} />
              <span>Compra</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', backgroundColor: '#ef4444', borderRadius: '2px' }} />
              <span>Venda</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', backgroundColor: '#3b82f6', borderRadius: '2px' }} />
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
            
            <button style={{ backgroundColor: '#fed7aa', color: '#92400e', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} onMouseOver={(e) => e.target.style.backgroundColor = '#fdba74'} onMouseOut={(e) => e.target.style.backgroundColor = '#fed7aa'}>
              <AiOutlinePlus size={18} />
              Nova Operação
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#dbeafe', color: '#334155', fontSize: '14px', borderBottom: '2px solid #93c5fd' }}>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>DATA</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Operação</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Ativo</th>
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
                          <span style={{ display: 'inline-flex', alignItems: 'center', paddingLeft: '0.625rem', paddingRight: '0.625rem', paddingTop: '0.25rem', paddingBottom: '0.25rem', borderRadius: '9999px', fontSize: '12px', fontWeight: 500, backgroundColor: '#dcfce7', color: '#166534' }}>
                            {row.operacao}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', fontWeight: 700, color: '#1e293b' }}>{row.ativo}</td>
                        <td style={{ padding: '1rem', textAlign: 'right', color: '#475569' }}>{row.qtde}</td>
                        <td style={{ padding: '1rem', textAlign: 'right', color: '#475569' }}>{formatarMoeda(row.preco)}</td>
                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#1e293b' }}>
                          {formatarMoeda(valorTotal)}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <button 
                            onClick={() => excluirOperacao(row.id)}
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
    </div>
  );
}
