import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

export default function NovaOperacaoModal({ isOpen, onClose }) {
  const [data, setData] = useState('');
  const [operacao, setOperacao] = useState('Compra');
  const [ativo, setAtivo] = useState('');
  const [qtde, setQtde] = useState('');
  const [valorUnidade, setValorUnidade] = useState('');
  
  const [ativosDisponiveis, setAtivosDisponiveis] = useState([]);

  // Carregar os ativos assim que o modal abrir
  useEffect(() => {
    if (isOpen) {
      // TODO: Conectar com a rota do backend
      setAtivosDisponiveis(['MXRF11', 'HGLG11', 'XPML11', 'KNCR11']);
      
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

  const handleCadastrar = (e) => {
    e.preventDefault();
    
    const novaOperacao = {
      data,
      operacao,
      ativo,
      qtde: Number(qtde),
      preco: Number(valorUnidade),
      valorTotal
    };

    console.log('Cadastrar Operação:', novaOperacao);
    onClose(); // Fecha o modal após "salvar"
  };

  // Estilizações em linha reaproveitáveis
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' };
  const inputStyle = { width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px', color: '#334155', outline: 'none' };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '0.5rem', width: '100%', maxWidth: '450px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
        
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>Nova Operação</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }} title="Fechar">
            <AiOutlineClose size={20} />
          </button>
        </div>

        <form onSubmit={handleCadastrar} style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Data da Operação</label>
              <input type="date" value={data} onChange={(e) => setData(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Operação</label>
              <select value={operacao} onChange={(e) => setOperacao(e.target.value)} style={{ ...inputStyle, backgroundColor: '#fff', cursor: 'pointer' }}>
                <option value="Compra">Compra</option>
                <option value="Venda">Venda</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Ativo</label>
            <select value={ativo} onChange={(e) => setAtivo(e.target.value)} required style={{ ...inputStyle, backgroundColor: '#fff', cursor: 'pointer' }}>
              <option value="" disabled>Selecione um ativo...</option>
              {ativosDisponiveis.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Quantidade</label>
              <input type="number" min="1" step="1" value={qtde} onChange={(e) => setQtde(Number(e.target.value) || '')} required style={inputStyle} placeholder="Ex: 10" />
            </div>
            <div>
              <label style={labelStyle}>Valor da Unidade (R$)</label>
              <input type="number" min="0.01" step="0.01" value={valorUnidade} onChange={(e) => setValorUnidade(Number(e.target.value) || '')} required style={inputStyle} placeholder="Ex: 10.50" />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.375rem', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>Valor Total:</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: operacao === 'Compra' ? '#10b981' : '#ef4444' }}>
              {operacao === 'Compra' ? '+ ' : '- '}{formatarMoeda(valorTotal)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.5rem 1rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}>
              Cancelar
            </button>
            <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', border: 'none', color: '#ffffff', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}>
              Cadastrar Operação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}