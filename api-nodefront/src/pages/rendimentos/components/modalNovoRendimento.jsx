import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const SEGMENTOS = ['Papel', 'Renda Urbana', 'Logística', 'Shoppings', 'Lajes Corporativas', 'Híbrido'];

export default function NovoRendimentoModal({ isOpen, onClose, onSuccess, ativos }) {
  const [data,      setData]      = useState('');
  const [ativo,     setAtivo]     = useState('');
  const [segmento,  setSegmento]  = useState('Papel');
  const [valor,     setValor]     = useState('');
  const [salvando,  setSalvando]  = useState(false);

  useEffect(() => {
    if (isOpen) {
      setData(new Date().toISOString().split('T')[0]);
      setAtivo(ativos[0] || '');
      setSegmento('Papel');
      setValor('');
    }
  }, [isOpen, ativos]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ativo || !valor || Number(valor) <= 0) return;

    setSalvando(true);
    // simula delay de API
    await new Promise(r => setTimeout(r, 400));
    setSalvando(false);

    onSuccess({
      data,
      ativo,
      segmento,
      valor: Number(valor),
    });
  };

  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' };
  const inputStyle = { width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px', color: '#334155', outline: 'none' };

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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Data do Recebimento</label>
              <input type="date" value={data} onChange={e => setData(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Ativo</label>
              <select value={ativo} onChange={e => setAtivo(e.target.value)} required style={{ ...inputStyle, backgroundColor: '#fff', cursor: 'pointer' }}>
                {ativos.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Segmento</label>
            <select value={segmento} onChange={e => setSegmento(e.target.value)} style={{ ...inputStyle, backgroundColor: '#fff', cursor: 'pointer' }}>
              {SEGMENTOS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

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

          {/* preview */}
          {valor > 0 && (
            <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', backgroundColor: '#f0fdf4', borderRadius: '0.375rem', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Valor a lançar:</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#15803d' }}>
                + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor))}
              </span>
            </div>
          )}

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
              type="submit" disabled={salvando}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', border: 'none', color: '#ffffff', borderRadius: '0.375rem', fontWeight: 600, cursor: salvando ? 'not-allowed' : 'pointer', opacity: salvando ? 0.6 : 1 }}
              onMouseOver={e => !salvando && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
              onMouseOut={e => !salvando && (e.currentTarget.style.backgroundColor = '#2563eb')}
            >
              {salvando ? 'Salvando...' : 'Lançar Rendimento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
