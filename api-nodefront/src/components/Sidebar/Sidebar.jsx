import React from 'react';
import { FaHome, FaUsers, FaCog, FaCircle, FaSignOutAlt, FaBars, FaTimes, FaWallet, FaChartLine, FaTags, FaExchangeAlt, FaFileAlt } from 'react-icons/fa';

function Sidebar({ currentPage, onNavigate, isOpen, onToggle }) {

  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: FaHome },
    { id: 'ControleAtivos', label: 'Controle de ativos', icon: FaWallet },
    { id: 'Rendimentos', label: 'Rendimentos', icon: FaChartLine },
    { id: 'Precificacao', label: 'Precificação', icon: FaTags },
    { id: 'Operacoes', label: 'Operações', icon: FaExchangeAlt },
    { id: 'Relatorios', label: 'Relatórios', icon: FaFileAlt },
    { id: 'usuarios', label: 'Usuários', icon: FaUsers },
    { id: 'configuracoes', label: 'Configurações', icon: FaCog }
  ];

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      // Aqui você pode adicionar lógica de logout
      console.log('Logout realizado');
      // localStorage.removeItem('token'); // Se usar token
      // window.location.href = '/login'; // Redirecionar para login
    }
  };

  return (
    <>
      {/* Botão Toggle - Visível quando sidebar está fechada */}
      {!isOpen && (
        <button
          onClick={onToggle}
          style={{
            position: 'fixed',
            left: '10px',
            top: '20px',
            zIndex: '1000',
            backgroundColor: '#2c3e50',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 12px',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          <FaBars size={20} />
        </button>
      )}

      {/* Sidebar */}
      <div style={{
        width: isOpen ? '250px' : '0px',
        height: '100vh',
        backgroundColor: '#2c3e50',
        padding: isOpen ? '20px' : '0px',
        position: 'fixed',
        left: 0,
        top: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        zIndex: '999'
      }}>
        {/* Botão Fechar - Visível quando sidebar está aberta */}
        {isOpen && (
          <button
            onClick={onToggle}
            style={{
              position: 'absolute',
              right: '15px',
              top: '15px',
              backgroundColor: 'transparent',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              padding: '0',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#34495e';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <FaTimes size={20} />
          </button>
        )}

        {/* Status do Servidor - Centralizado no topo */}
        {isOpen && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '30px',
            marginTop: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#34495e',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              color: '#fff'
            }}>
              <FaCircle size={10} style={{ color: '#2ecc71' }} />
              <span>Servidor Online</span>
            </div>
          </div>
        )}

        {/* Menu */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  // Opcional: fecha a sidebar em telas pequenas
                }}
                title={!isOpen ? item.label : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isOpen ? '12px' : '0px',
                  padding: '12px 15px',
                  backgroundColor: isActive ? '#3498db' : 'transparent',
                  color: isActive ? '#fff' : '#bdc3c7',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: isActive ? 'bold' : 'normal',
                  transition: 'all 0.3s ease',
                  borderLeft: isActive ? '4px solid #fff' : '4px solid transparent',
                  justifyContent: isOpen ? 'flex-start' : 'center',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = '#34495e';
                    e.target.style.color = '#ecf0f1';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#bdc3c7';
                  }
                }}
              >
                <Icon size={20} />
                {isOpen && <span>{item.label}</span>}
              </button>
            );
        })}
      </nav>

      {/* Logout Button - Parte inferior */}
      {isOpen && (
        <div style={{
          borderTop: '2px solid #34495e',
          paddingTop: '15px',
          marginTop: 'auto'
        }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 15px',
              backgroundColor: '#e74c3c',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              width: '100%',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#c0392b';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#e74c3c';
            }}
          >
            <FaSignOutAlt size={20} />
            <span>Sair</span>
          </button>
        </div>
      )}
    </div>
    </>
  );
}

export default Sidebar;
