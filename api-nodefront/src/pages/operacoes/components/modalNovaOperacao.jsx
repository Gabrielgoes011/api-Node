import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import API_BASE_URL from '../../../config/api';

export default function NovaOperacaoModal({ isOpen, onClose, onSuccess }) {
  const [data, setData] = useState('');
  const [operacao, setOperacao] = useState('Compra');
  const [ativo, setAtivo] = useState('');
  const [qtde, setQtde] = useState('');
  const [valorUnidade, setValorUnidade] = useState('');
  
  const [ativosDisponiveis, setAtivosDisponiveis] = useState([]);
  const [carregando, setCarregando] = useState(false);

  // Carregar os ativos assim que o modal abrir
  useEffect(() => {
    if (isOpen) {
      setCarregando(true);
      
      // Buscar ativos do backend
      const fetchAtivos = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/ativosDropList`);
          if (response.ok) {
            const data = await response.json();
            setAtivosDisponiveis(data);
          } else {
            console.error('Erro ao carregar ativos');
            setAtivosDisponiveis([]);
          }
        } catch (error) {
          console.error('Erro ao buscar ativos:', error);
          setAtivosDisponiveis([]);
        } finally {
          setCarregando(false);
        }
      };

      fetchAtivos();
      
      setData(new Date().toISOString().split('T')[0]); 
      setOperacao('Compra');
      setAtivo('');
      setQtde('');
      setValorUnidade('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculo automático do valor total
  const valorTotal = (Number(qtde) || 0) * (Number(valorUnidade) || 0);

  // Função de formatação para exibir o Valor Total em R$
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const handleCadastrar = async (e) => {
    e.preventDefault();
    
    // Buscar o id do ativo selecionado
    const ativoSelecionado = ativosDisponiveis.find(a => a.ticker === ativo);
    
    if (!ativoSelecionado) {
      console.error('Selecione um ativo válido');
      return;
    }

    const novaOperacao = {
      idAtivo: ativoSelecionado.id,
      dataOperacao: data,
      tipo: operacao,
      quantidade: Number(qtde),
      preco: Number(valorUnidade)
    };

    try {
      setCarregando(true);
      const response = await fetch(`${API_BASE_URL}/lancarOperacao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaOperacao)
      });

      if (response.ok) {
        console.log('Operação cadastrada com sucesso!');
        onClose();
        if (onSuccess) onSuccess(); // Recarregar dados
      } else {
        const errorData = await response.json();
        console.error('Erro ao cadastrar operação:', errorData.message || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro ao cadastrar operação:', error);
    } finally {
      setCarregando(false);
    }
  };

  // Estilizações em linha reaproveitáveis
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' };
  const inputStyle = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', boxSizing: 'border-box', fontSize: '14px', color: '#f8fafc', outline: 'none', transition: 'border-color 0.2s' };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', width: '100%', maxWidth: '450px', boxShadow: '0 24px 60px rgba(0,0,0,0.6)', overflow: 'hidden' }}>
        
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>Nova Operação</h3>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: '5px', transition: 'all 0.15s' }}
            onMouseOver={e => { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseOut={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            title="Fechar">
            <AiOutlineClose size={18} />
          </button>
        </div>

        <form onSubmit={handleCadastrar} style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Data da Operação</label>
              <input type="date" value={data} onChange={(e) => setData(e.target.value)} required style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = '#334155'} />
            </div>
            <div>
              <label style={labelStyle}>Operação</label>
              <select value={operacao} onChange={(e) => setOperacao(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="Compra">Compra</option>
                <option value="Venda">Venda</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Ativo</label>
            <select value={ativo} onChange={(e) => setAtivo(e.target.value)} required disabled={ativosDisponiveis.length === 0} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="" disabled>Selecione um ativo...</option>
              {ativosDisponiveis.map(a => (
                <option key={a.id} value={a.ticker}>{a.ticker}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Quantidade</label>
              <input type="number" min="1" step="1" value={qtde} onChange={(e) => setQtde(Number(e.target.value) || '')} required style={inputStyle} placeholder="Ex: 10"
                onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = '#334155'} />
            </div>
            <div>
              <label style={labelStyle}>Valor da Unidade (R$)</label>
              <input type="number" min="0.01" step="0.01" value={valorUnidade} onChange={(e) => setValorUnidade(Number(e.target.value) || '')} required style={inputStyle} placeholder="Ex: 10.50"
                onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = '#334155'} />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8' }}>Valor Total:</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: operacao === 'Compra' ? '#10b981' : '#ef4444' }}>
              {operacao === 'Compra' ? '+ ' : '- '}{formatarMoeda(valorTotal)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" onClick={onClose} disabled={carregando}
              style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '8px', fontWeight: 600, cursor: carregando ? 'not-allowed' : 'pointer', opacity: carregando ? 0.6 : 1, transition: 'all 0.15s' }}
              onMouseOver={e => { if (!carregando) { e.currentTarget.style.borderColor = '#475569'; e.currentTarget.style.color = '#f8fafc'; } }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#94a3b8'; }}>
              Cancelar
            </button>
            <button type="submit" disabled={carregando}
              style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#ffffff', borderRadius: '8px', fontWeight: 600, cursor: carregando ? 'not-allowed' : 'pointer', opacity: carregando ? 0.6 : 1, boxShadow: '0 4px 16px rgba(16,185,129,0.3)', transition: 'all 0.15s' }}
              onMouseOver={e => { if (!carregando) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(16,185,129,0.45)'; } }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(16,185,129,0.3)'; }}>
              {carregando ? 'Cadastrando...' : 'Cadastrar Operação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}