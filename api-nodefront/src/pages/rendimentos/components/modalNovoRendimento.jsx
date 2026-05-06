import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { rendimentosService } from '../../../services/servRendimentos/rendimentosService';

export default function NovoRendimentoModal({ isOpen, onClose, onSuccess }) {
  const [data,          setData]          = useState('');
  const [ativoId,       setAtivoId]       = useState('');
  const [valor,         setValor]         = useState('');
  const [salvando,      setSalvando]      = useState(false);
  const [ativos,        setAtivos]        = useState([]); // [{ id, ticker, nomeSeguimento }]
  const [carregando,    setCarregando]    = useState(false);

  // Ativo selecionado (objeto completo)
  const ativoSelecionado = ativos.find(a => String(a.idAtivo) === String(ativoId));

  // Carrega ativos da API ao abrir o modal
  useEffect(() => {
    if (!isOpen) return;
    setData(new Date().toISOString().split('T')[0]);
    setAtivoId('');
    setValor('');

    const buscarAtivos = async () => {
      setCarregando(true);
      try {
        const resultado = await rendimentosService.carregarAtivosModal();
        setAtivos(resultado);
        if (resultado.length > 0) setAtivoId(String(resultado[0].idAtivo));
      } catch (err) {
        console.error('Erro ao carregar ativos:', err);
        setAtivos([]);
      } finally {
        setCarregando(false);
      }
    };
    buscarAtivos();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ativoId || !valor || Number(valor) <= 0) return;

    setSalvando(true);
    try {
      await onSuccess({
        idAtivo:      Number(ativoId),
        ticker:       ativoSelecionado?.ticker,
        segmento:     ativoSelecionado?.nomeSeguimento,
        dtRendimento: data,
        valorRecebido: Number(valor),
      });
    } finally {
      setSalvando(false);
    }
  };

  const labelStyle = {
    display: 'block', fontSize: '12px', fontWeight: 600,
    color: '#475569', marginBottom: '4px',
  };
  const inputStyle = {
    width: '100%', padding: '0.5rem', borderRadius: '0.375rem',
    border: '1px solid #cbd5e1', boxSizing: 'border-box',
    fontSize: '14px', color: '#334155', outline: 'none',
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '0.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>

        {/* header */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>Novo Rendimento</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }} title="Fechar">
            <AiOutlineClose size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>

          {/* Data + Ativo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Data do Recebimento</label>
              <input
                type="date" value={data}
                onChange={e => setData(e.target.value)}
                required style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Ativo</label>
              <select
                value={ativoId}
                onChange={e => setAtivoId(e.target.value)}
                required
                disabled={carregando}
                style={{ ...inputStyle, backgroundColor: '#fff', cursor: carregando ? 'wait' : 'pointer' }}
              >
                {carregando
                  ? <option>Carregando...</option>
                  : ativos.map(a => (
                      <option key={a.idAtivo} value={a.idAtivo}>{a.ticker}</option>
                    ))
                }
              </select>
            </div>
          </div>

          {/* Segmento — carregado automaticamente ao selecionar o ativo */}
          {ativoSelecionado && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Segmento</label>
              <div style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '0.375rem',
                fontSize: '14px',
                color: '#334155',
                fontWeight: 500,
              }}>
                {ativoSelecionado.nomeSeguimento}
              </div>
            </div>
          )}

          {/* Valor */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Valor Recebido (R$)</label>
            <input
              type="number" min="0.01" step="0.01"
              value={valor}
              onChange={e => setValor(e.target.value)}
              required
              placeholder="Ex: 52.40"
              style={inputStyle}
            />
          </div>

          {/* Preview */}
          {Number(valor) > 0 && (
            <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', backgroundColor: '#f0fdf4', borderRadius: '0.375rem', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Valor a lançar:</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#15803d' }}>
                + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor))}
              </span>
            </div>
          )}

          {/* Botões */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button
              type="button" onClick={onClose} disabled={salvando}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '0.375rem', fontWeight: 600, cursor: salvando ? 'not-allowed' : 'pointer', opacity: salvando ? 0.6 : 1 }}
              onMouseOver={e => !salvando && (e.currentTarget.style.backgroundColor = '#f1f5f9')}
              onMouseOut={e => !salvando && (e.currentTarget.style.backgroundColor = '#ffffff')}
            >
              Cancelar
            </button>
            <button
              type="submit" disabled={salvando || carregando}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', border: 'none', color: '#ffffff', borderRadius: '0.375rem', fontWeight: 600, cursor: (salvando || carregando) ? 'not-allowed' : 'pointer', opacity: (salvando || carregando) ? 0.6 : 1 }}
              onMouseOver={e => !(salvando || carregando) && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
              onMouseOut={e => !(salvando || carregando) && (e.currentTarget.style.backgroundColor = '#2563eb')}
            >
              {salvando ? 'Salvando...' : 'Lançar Rendimento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
