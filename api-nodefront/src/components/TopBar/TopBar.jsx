import React, { useMemo, useState, useRef, useEffect } from 'react';
import { FaKey, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';

// ─────────────────────────────────────────────────────────────────────────────
// Lê os dados do usuário logado direto do payload do JWT no localStorage.
// ─────────────────────────────────────────────────────────────────────────────
function useUsuarioLogado() {
  return useMemo(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { nome: 'Usuário', email: '', iniciais: 'U' };

      const payload = JSON.parse(atob(token.split('.')[1]));
      const nome = payload.nome || payload.email || 'Usuário';
      const email = payload.email || '';
      const iniciais = nome
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0].toUpperCase())
        .join('');

      return { nome, email, iniciais };
    } catch {
      return { nome: 'Usuário', email: '', iniciais: 'U' };
    }
  }, []);
}

// ─────────────────────────────────────────────────────────────────────────────
// TopBar
//
// Props:
//   sidebarOpen  — boolean, acompanha a sidebar na transição
//   fotoUrl      — string (opcional), URL da foto de perfil
//   onLogout     — função chamada ao confirmar logout
//   onTrocarSenha — função chamada ao clicar em Trocar Senha (implementar depois)
// ─────────────────────────────────────────────────────────────────────────────
function TopBar({ sidebarOpen = true, fotoUrl = null, onLogout, onTrocarSenha }) {
  const { nome, email, iniciais } = useUsuarioLogado();
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);

  // Fecha o menu ao clicar fora dele
  useEffect(() => {
    const handleClickFora = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    };
    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, []);

  const handleLogout = () => {
    setMenuAberto(false);
    if (onLogout) onLogout();
  };

  const handleTrocarSenha = () => {
    setMenuAberto(false);
    if (onTrocarSenha) onTrocarSenha();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: sidebarOpen ? '250px' : '0px',
        right: 0,
        height: '60px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 24px',
        zIndex: 998,
        transition: 'left 0.3s ease',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {/* Área clicável do usuário */}
      <div ref={menuRef} style={{ position: 'relative' }}>

        {/* Trigger — nome + avatar + chevron */}
        <button
          onClick={() => setMenuAberto((v) => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px 10px',
            borderRadius: '8px',
            transition: 'background 0.15s',
            backgroundColor: menuAberto ? '#f1f5f9' : 'transparent',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = menuAberto ? '#f1f5f9' : 'transparent'}
        >
          {/* Nome e email */}
          <div style={{ textAlign: 'right', lineHeight: 1.3 }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
              {nome}
            </div>
            {email && (
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                {email}
              </div>
            )}
          </div>

          {/* Avatar */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '2px solid #e2e8f0',
            }}
          >
            {fotoUrl ? (
              <img src={fotoUrl} alt={nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: 700, userSelect: 'none' }}>
                {iniciais}
              </span>
            )}
          </div>

          {/* Chevron */}
          <FaChevronDown
            size={11}
            color="#94a3b8"
            style={{
              transition: 'transform 0.2s',
              transform: menuAberto ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </button>

        {/* Menu suspenso */}
        {menuAberto && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              minWidth: '200px',
              overflow: 'hidden',
              zIndex: 1000,
            }}
          >
            {/* Cabeçalho do menu */}
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid #f1f5f9',
              backgroundColor: '#f8fafc',
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{nome}</div>
              {email && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{email}</div>}
            </div>

            {/* Trocar Senha */}
            <button
              onClick={handleTrocarSenha}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '11px 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#475569',
                textAlign: 'left',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <FaKey size={14} color="#64748b" />
              Trocar Senha
            </button>

            {/* Divisória */}
            <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

            {/* Sair */}
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '11px 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#ef4444',
                textAlign: 'left',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff1f2'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <FaSignOutAlt size={14} color="#ef4444" />
              Sair
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopBar;
