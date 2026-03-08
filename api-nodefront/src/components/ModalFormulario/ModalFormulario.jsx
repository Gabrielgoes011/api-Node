import React from 'react';

function ModalFormulario({ onClose, onSubmit, isEditing, formData, setFormData }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', width: '90%', maxWidth: '500px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#999' }}
        >
          ✖
        </button>

        <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>
          {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
        </h2>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="text"
            placeholder="Nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            style={{ padding: '12px', fontSize: '16px', width: '100%', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="number"
              placeholder="Idade"
              value={formData.idade}
              onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
              style={{ padding: '12px', fontSize: '16px', width: '100%', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <input
              type="text"
              placeholder="CPF"
              value={formData.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
              style={{ padding: '12px', fontSize: '16px', width: '100%', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ padding: '12px', fontSize: '16px', width: '100%', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
          />

          {!isEditing && (
            <>
              <input
                type="password"
                placeholder="Senha"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                style={{ padding: '12px', fontSize: '16px', width: '100%', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
              />

              <input
                type="password"
                placeholder="Confirme a Senha"
                value={formData.confirmaSenha}
                onChange={(e) => setFormData({ ...formData, confirmaSenha: e.target.value })}
                style={{ padding: '12px', fontSize: '16px', width: '100%', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </>
          )}

          <button
            type="submit"
            style={{ padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', width: '100%', fontWeight: 'bold', marginTop: '10px' }}
          >
            {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModalFormulario;
