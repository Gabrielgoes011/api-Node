import React from 'react';
import { FiAlertTriangle, FiCheckCircle, FiX } from 'react-icons/fi';

function ModalConfirmacao({ onClose, onConfirm, action, userName }) {
  const isDestructive = action === 'delete' || action === 'inactivate';

  const getMessageText = () => {
    switch (action) {
      case 'delete':
        return <>Você tem certeza que quer <strong style={{ color: '#f87171' }}>excluir</strong> o usuário <strong style={{ color: '#f8fafc' }}>{userName}</strong>? Esta ação não pode ser desfeita.</>;
      case 'reset':
        return <>Deseja resetar a senha do usuário <strong style={{ color: '#f8fafc' }}>{userName}</strong> para o padrão?<br /><br />
          <span style={{ display: 'inline-block', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '6px 14px', borderRadius: '8px', color: '#10b981', fontFamily: 'monospace', fontSize: '14px', letterSpacing: '1px' }}>Senha@123</span>
        </>;
      case 'inactivate':
        return <>Deseja <strong style={{ color: '#f59e0b' }}>inativar</strong> o usuário <strong style={{ color: '#f8fafc' }}>{userName}</strong>?</>;
      case 'reactivate':
        return <>Deseja <strong style={{ color: '#10b981' }}>reativar</strong> o usuário <strong style={{ color: '#f8fafc' }}>{userName}</strong>?</>;
      default:
        return '';
    }
  };

  const confirmColor = isDestructive ? '#f87171' : '#10b981';
  const confirmBg    = isDestructive
    ? 'linear-gradient(135deg, #ef4444, #dc2626)'
    : 'linear-gradient(135deg, #10b981, #059669)';
  const confirmShadow = isDestructive
    ? '0 4px 16px rgba(239,68,68,0.3)'
    : '0 4px 16px rgba(16,185,129,0.3)';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1100,
    }}>
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        maxWidth: '420px', width: '90%',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Botão fechar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '14px', right: '14px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid #334155',
            borderRadius: '8px', color: '#64748b',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            padding: '5px', transition: 'all 0.15s',
          }}
          onMouseOver={e => { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          onMouseOut={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        >
          <FiX size={16} />
        </button>

        {/* Ícone */}
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: isDestructive ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
          border: `1px solid ${isDestructive ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.25rem',
        }}>
          {isDestructive
            ? <FiAlertTriangle size={24} color="#f87171" />
            : <FiCheckCircle size={24} color="#10b981" />
          }
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>
          Confirmação
        </h3>

        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '1.75rem', lineHeight: 1.6 }}>
          {getMessageText()}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 22px',
              background: 'transparent',
              border: '1px solid #334155',
              borderRadius: '8px', color: '#94a3b8',
              cursor: 'pointer', fontWeight: 600, fontSize: '14px',
              transition: 'all 0.15s',
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#475569'; e.currentTarget.style.color = '#f8fafc'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '10px 22px',
              background: confirmBg,
              border: 'none', borderRadius: '8px',
              color: '#fff', cursor: 'pointer',
              fontWeight: 600, fontSize: '14px',
              boxShadow: confirmShadow,
              transition: 'all 0.15s',
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'none'; }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmacao;
