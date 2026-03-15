import React, { useState, useRef } from 'react';
import { FaUser, FaCamera } from 'react-icons/fa';
import { toast } from 'react-toastify';

function ModalFormulario({ onClose, onSubmit, isEditing, formData, setFormData }) {
  const [fotoPreview, setFotoPreview] = useState(formData.foto || null);
  const fileInputRef = useRef(null);

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
          {/* Foto de Perfil */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <label
              htmlFor="fotoPerfil"
              style={{
                position: 'relative',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2px solid #ccc',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => e.target.style.borderColor = '#007bff'}
              onMouseLeave={(e) => e.target.style.borderColor = '#ccc'}
              onClick={(e) => {
                e.preventDefault(); // Previne o comportamento padrão
                toast.info('Função de upload de foto em desenvolvimento. Em breve disponível!');
                // Ainda abre o seletor para simular
                setTimeout(() => fileInputRef.current?.click(), 100);
              }}
            >
              {fotoPreview ? (
                <img src={fotoPreview} alt="Foto de perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <FaUser size={40} color="#666" />
              )}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,123,255,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.opacity = 1}
                onMouseLeave={(e) => e.target.style.opacity = 0}
              >
                <FaCamera size={25} color="#fff" />
              </div>
            </label>
            <input
              type="file"
              id="fotoPerfil"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
          </div>
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
