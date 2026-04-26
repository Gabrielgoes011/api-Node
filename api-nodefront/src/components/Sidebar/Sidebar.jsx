import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaCog, FaCircle, FaSignOutAlt, FaBars, FaTimes, FaWallet, FaChartLine, FaTags, FaExchangeAlt, FaFileAlt, FaFolder, FaChevronDown, FaChevronUp } from 'react-icons/fa';

function Sidebar({ isOpen, onToggle, onLogout }) {
  const [cadastrosOpen, setCadastrosOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  useEffect(() => {
    if (['/cadastros/meusfiis', '/cadastros/seguimentos', '/cadastros/usuarios'].includes(currentPath)) {
      setCadastrosOpen(true);
    }
  }, [currentPath]);

  const menuItems = [
    { id: 'dashboard', path: '/', label: 'Início', icon: FaHome },
    { id: 'controle-ativos', path: '/controle-ativos', label: 'Controle de ativos', icon: FaWallet },
    { id: 'operacoes', path: '/operacoes', label: 'Operações', icon: FaExchangeAlt },
    { id: 'precificacao', path: '/precificacao', label: 'Precificação', icon: FaTags },
    { id: 'rendimentos', path: '/rendimentos', label: 'Rendimentos', icon: FaChartLine },
    { id: 'relatorios', path: '/relatorios', label: 'Relatórios', icon: FaFileAlt },
    { id: 'configuracoes', path: '/configuracoes', label: 'Configurações', icon: FaCog }
  ];

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* Botão Toggle - Visível quando sidebar está fechada */}
      {!isOpen && (
        <button
          type="button"
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
            type="button"
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
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <React.Fragment key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    navigate(item.path);
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

                {index === 0 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setCadastrosOpen(!cadastrosOpen)}
                      title={!isOpen ? 'Cadastros' : ''}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: isOpen ? '12px' : '0px',
                        padding: '12px 15px',
                        backgroundColor: cadastrosOpen ? '#3498db' : 'transparent',
                        color: cadastrosOpen ? '#fff' : '#bdc3c7',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: cadastrosOpen ? 'bold' : 'normal',
                        transition: 'all 0.3s ease',
                        borderLeft: cadastrosOpen ? '4px solid #fff' : '4px solid transparent',
                        justifyContent: isOpen ? 'space-between' : 'center',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        if (!cadastrosOpen) {
                          e.target.style.backgroundColor = '#34495e';
                          e.target.style.color = '#ecf0f1';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!cadastrosOpen) {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#bdc3c7';
                        }
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaFolder size={20} />
                        {isOpen && <span>Cadastros</span>}
                      </span>
                      {isOpen && (cadastrosOpen ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />)}
                    </button>

                    {cadastrosOpen && isOpen && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginLeft: '5px', marginBottom: '8px' }}>
                        <button
                          type="button"
                          onClick={() => navigate('/cadastros/meusfiis')}
                          style={{
                            color: currentPath === '/cadastros/meusfiis' ? '#1d4ed8' : '#ecf0f1',
                            backgroundColor: currentPath === '/cadastros/meusfiis' ? '#ebf4ff' : 'transparent',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 10px',
                            textAlign: 'left',
                            cursor: 'pointer'
                          }}
                        >
                          Meus Fundos
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate('/cadastros/seguimentos')}
                          style={{
                            color: currentPath === '/cadastros/seguimentos' ? '#1d4ed8' : '#ecf0f1',
                            backgroundColor: currentPath === '/cadastros/seguimentos' ? '#ebf4ff' : 'transparent',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 10px',
                            textAlign: 'left',
                            cursor: 'pointer'
                          }}
                        >
                          Segmentos
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate('/cadastros/usuarios')}
                          style={{
                            color: currentPath === '/cadastros/usuarios' ? '#1d4ed8' : '#ecf0f1',
                            backgroundColor: currentPath === '/cadastros/usuarios' ? '#ebf4ff' : 'transparent',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 10px',
                            textAlign: 'left',
                            cursor: 'pointer'
                          }}
                        >
                          Usuários
                        </button>
                      </div>
                    )}
                  </>
                )}
              </React.Fragment>
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
            type="button"
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

      {/* Modal de Confirmação de Logout */}
      {showLogoutModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(2px)' // Dá um efeito de desfoque no fundo
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            width: '100%',
            maxWidth: '350px',
            textAlign: 'center',
            fontFamily: 'sans-serif'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '1.4rem' }}>Sair do sistema</h3>
            <p style={{ margin: '0 0 25px 0', color: '#7f8c8d', fontSize: '1rem' }}>Tem certeza que deseja sair?</p>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={cancelLogout}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#ecf0f1',
                  color: '#2c3e50',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#bdc3c7'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ecf0f1'}
              >
                Cancelar
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
