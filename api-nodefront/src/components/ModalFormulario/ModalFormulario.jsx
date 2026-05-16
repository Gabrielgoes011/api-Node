import React, { useState, useRef } from 'react';
import { FaUser, FaCamera } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { toastInfo } from '../../utils/responseUtils';

const inputStyle = {
  padding: '0.75rem 1rem',
  fontSize: '14px',
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: '8px',
  border: '1px solid #334155',
  background: '#0f172a',
  color: '#f8fafc',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

function ModalFormulario({ onClose, onSubmit, isEditing, formData, setFormData }) {
  const [fotoPreview] = useState(formData.foto || null);
  const fileInputRef = useRef(null);

  const handleFocus = (e) => {
    e.target.style.borderColor = '#10b981';
    e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.12)';
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = '#334155';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        width: '90%', maxWidth: '500px',
        position: 'relative',
        maxHeight: '90vh', overflowY: 'auto',
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

        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
          {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
        </h2>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Avatar */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <label
              htmlFor="fotoPerfil"
              style={{
                position: 'relative', width: '88px', height: '88px',
                borderRadius: '50%',
                background: '#0f172a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                border: '2px solid #334155',
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#10b981'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#334155'}
              onClick={e => {
                e.preventDefault();
                toastInfo('Função de upload de foto em desenvolvimento. Em breve disponível!');
                setTimeout(() => fileInputRef.current?.click(), 100);
              }}
            >
              {fotoPreview
                ? <img src={fotoPreview} alt="Foto de perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <FaUser size={34} color="#475569" />
              }
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(16,185,129,0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0, transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}
              >
                <FaCamera size={22} color="#fff" />
              </div>
            </label>
            <input type="file" id="fotoPerfil" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} />
          </div>

          {/* Nome */}
          <input
            type="text"
            placeholder="Nome"
            value={formData.nome}
            onChange={e => setFormData({ ...formData, nome: e.target.value })}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          {/* Data + CPF */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Data de Nascimento (DD/MM/AAAA)"
              value={formData.dataNascimento}
              onChange={e => setFormData({ ...formData, dataNascimento: e.target.value })}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <input
              type="text"
              placeholder="CPF"
              value={formData.cpf}
              onChange={e => setFormData({ ...formData, cpf: e.target.value })}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          {/* Botão submit */}
          <button
            type="submit"
            style={{
              padding: '0.875rem',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff', border: 'none', borderRadius: '8px',
              cursor: 'pointer', fontSize: '14px', fontWeight: 700,
              width: '100%', marginTop: '6px',
              boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(16,185,129,0.45)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(16,185,129,0.3)'; }}
          >
            {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModalFormulario;
