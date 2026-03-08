import React from 'react';

function ModalConfirmacao({ onClose, onConfirm, action, userName }) {
  const getMessageText = () => {
    switch (action) {
      case 'delete':
        return <>Você tem certeza que quer <strong>excluir</strong> o usuário <strong>{userName}</strong>?</>;
      case 'reset':
        return <>Deseja resetar a senha do usuário <strong>{userName}</strong> para o padrão?<br /><br /><strong style={{ backgroundColor: '#eee', padding: '5px 10px', borderRadius: '4px', color: '#d63384' }}>Senha@123</strong></>;
      case 'inactivate':
        return <>Deseja <strong>inativar</strong> o usuário <strong>{userName}</strong>?</>;
      case 'reactivate':
        return <>Deseja <strong>reativar</strong> o usuário <strong>{userName}</strong>?</>;
      default:
        return '';
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
      <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>Confirmação</h3>

        <p style={{ marginBottom: '25px', fontSize: '16px', color: '#555' }}>
          {getMessageText()}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <button
            onClick={onClose}
            style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{ padding: '10px 20px', backgroundColor: action === 'delete' ? '#dc3545' : '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmacao;
