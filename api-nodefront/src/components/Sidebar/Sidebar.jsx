import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome, FaCog, FaCircle, FaBars, FaTimes,
  FaWallet, FaChartLine, FaTags, FaExchangeAlt,
  FaFileAlt, FaFolder, FaChevronDown, FaChevronUp,
} from 'react-icons/fa';
import { FiTrendingUp } from 'react-icons/fi';
import useBreakpoint from '../../hooks/useBreakpoint';

function Sidebar({ isOpen, onToggle }) {
  const { isMobile } = useBreakpoint();
  const [cadastrosOpen, setCadastrosOpen] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const currentPath = location.pathname;

  // Touch / swipe state
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const sidebarRef = useRef(null);

  // On mobile, initialize sidebar closed — handled by parent (Layout) via isMobile prop,
  // but we also close it whenever we switch to mobile view while it was open.
  useEffect(() => {
    if (isMobile && isOpen) {
      onToggle(); // close sidebar when switching to mobile
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // Close sidebar on navigation in mobile view (Req 2.x / design spec)
  useEffect(() => {
    if (isMobile && isOpen) {
      onToggle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath]);

  // Open cadastros submenu when on a cadastros sub-route
  useEffect(() => {
    if (['/cadastros/meusfiis', '/cadastros/seguimentos', '/cadastros/usuarios'].includes(currentPath)) {
      setCadastrosOpen(true);
    }
  }, [currentPath]);

  // ── Swipe-to-close gesture (Req 9.4) ──────────────────────────────────────
  const handleTouchStart = useCallback((e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (touchStartXRef.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Swipe left (negative deltaX) with more horizontal than vertical movement
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    const isSwipeLeft = deltaX < -50;

    if (isMobile && isOpen && isHorizontalSwipe && isSwipeLeft) {
      onToggle();
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  }, [isMobile, isOpen, onToggle]);

  // ── Menu items ─────────────────────────────────────────────────────────────
  const menuItems = [
    { id: 'dashboard',       path: '/',                label: 'Início',             icon: FaHome },
    { id: 'controle-ativos', path: '/controle-ativos', label: 'Controle de Ativos', icon: FaWallet },
    { id: 'operacoes',       path: '/operacoes',       label: 'Operações',          icon: FaExchangeAlt },
    { id: 'precificacao',    path: '/precificacao',    label: 'Precificação',       icon: FaTags },
    { id: 'rendimentos',     path: '/rendimentos',     label: 'Rendimentos',        icon: FaChartLine },
    { id: 'relatorios',      path: '/relatorios',      label: 'Relatórios',         icon: FaFileAlt },
    { id: 'configuracoes',   path: '/configuracoes',   label: 'Configurações',      icon: FaCog },
  ];

  const subItems = [
    { path: '/cadastros/meusfiis',    label: 'Meus Fundos' },
    { path: '/cadastros/seguimentos', label: 'Segmentos' },
    { path: '/cadastros/usuarios',    label: 'Usuários' },
  ];

  // ── Derived styles ─────────────────────────────────────────────────────────
  // On mobile: slide in/out via translateX; width is always 250px so content
  // doesn't collapse during the transition.
  // On desktop: keep the existing width-based open/close behaviour.
  const sidebarStyle = isMobile
    ? {
        width: '250px',
        height: '100vh',
        background: 'linear-gradient(180deg, #0d1b2a 0%, #0f172a 100%)',
        borderRight: '1px solid #1e293b',
        position: 'fixed',
        left: 0,
        top: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease',
        zIndex: 999,
        boxShadow: isOpen ? '4px 0 24px rgba(0,0,0,0.4)' : 'none',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      }
    : {
        width: isOpen ? '250px' : '0px',
        height: '100vh',
        background: 'linear-gradient(180deg, #0d1b2a 0%, #0f172a 100%)',
        borderRight: isOpen ? '1px solid #1e293b' : 'none',
        position: 'fixed',
        left: 0,
        top: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        zIndex: 999,
        boxShadow: isOpen ? '4px 0 24px rgba(0,0,0,0.4)' : 'none',
      };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Hamburger button (Req 2.7, 9.2) ──────────────────────────────── */}
      {/* On mobile: always visible (sidebar is an overlay).
          On desktop: visible only when sidebar is closed. */}
      {(isMobile || !isOpen) && (
        <button
          type="button"
          aria-label="Abrir menu de navegação"
          onClick={onToggle}
          style={{
            position: 'fixed',
            left: '0px',
            top: '0px',
            zIndex: 1000,
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
            borderRadius: '0 0 8px 0',
            // Minimum 48×48 touch target (Req 2.7)
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}
        >
          <FaBars size={18} />
        </button>
      )}

      {/* ── Mobile backdrop (Req 2.4, 2.5) ───────────────────────────────── */}
      {isMobile && isOpen && (
        <div
          aria-hidden="true"
          onClick={onToggle}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 998,
            transition: 'opacity 0.2s ease',
          }}
        />
      )}

      {/* ── Sidebar panel ─────────────────────────────────────────────────── */}
      <div
        ref={sidebarRef}
        style={sidebarStyle}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Always render inner content on mobile (panel slides in/out via transform).
            On desktop only render when open (width collapses to 0 when closed). */}
        {(isOpen || isMobile) && (
          <>
            {/* ── Logo / Branding ── */}
            <div style={{
              padding: '20px 20px 0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 16px rgba(16,185,129,0.4)',
                  flexShrink: 0,
                }}>
                  <FiTrendingUp size={18} color="#fff" />
                </div>
                <span style={{
                  fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc',
                  letterSpacing: '-0.3px',
                }}>
                  FII<span style={{ color: '#10b981' }}>Track</span>
                </span>
              </div>

              {/* Close button */}
              <button
                type="button"
                aria-label="Fechar menu de navegação"
                onClick={onToggle}
                style={{
                  background: 'transparent', color: '#64748b',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  // 48px touch target on mobile, 28px on desktop
                  width: isMobile ? '48px' : '28px',
                  height: isMobile ? '48px' : '28px',
                  borderRadius: '6px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = '#f8fafc'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* ── Status servidor ── */}
            <div style={{ padding: '16px 20px 20px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
                padding: '5px 12px', borderRadius: '20px',
                fontSize: '12px', color: '#10b981', fontWeight: 500,
              }}>
                <FaCircle size={7} style={{ color: '#10b981', filter: 'drop-shadow(0 0 4px #10b981)' }} />
                Servidor Online
              </div>
            </div>

            {/* ── Divisória ── */}
            <div style={{ height: '1px', background: '#1e293b', margin: '0 20px 12px' }} />
          </>
        )}

        {/* ── Menu ── */}
        <nav
          aria-label="Navegação principal"
          style={{
            display: 'flex', flexDirection: 'column', gap: '4px',
            padding: (isOpen || isMobile) ? '0 12px' : '60px 0 0',
            flex: 1,
          }}
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            const showLabel = isOpen || isMobile;

            return (
              <React.Fragment key={item.id}>
                <button
                  type="button"
                  onClick={() => navigate(item.path)}
                  title={!showLabel ? item.label : ''}
                  style={{
                    display: 'flex', alignItems: 'center',
                    gap: showLabel ? '10px' : '0',
                    padding: showLabel ? '10px 12px' : '12px',
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))'
                      : 'transparent',
                    color: isActive ? '#10b981' : '#64748b',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.2s ease',
                    borderLeft: isActive ? '3px solid #10b981' : '3px solid transparent',
                    justifyContent: showLabel ? 'flex-start' : 'center',
                    whiteSpace: 'nowrap',
                    width: '100%',
                    textAlign: 'left',
                    // Ensure 48px min height on mobile for touch targets (Req 2.7)
                    minHeight: isMobile ? '48px' : 'auto',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.color = '#94a3b8';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#64748b';
                    }
                  }}
                >
                  <Icon size={17} />
                  {showLabel && <span>{item.label}</span>}
                </button>

                {/* Cadastros (submenu) — inserted after "Início" */}
                {index === 0 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setCadastrosOpen(!cadastrosOpen)}
                      title={!showLabel ? 'Cadastros' : ''}
                      style={{
                        display: 'flex', alignItems: 'center',
                        gap: showLabel ? '10px' : '0',
                        padding: showLabel ? '10px 12px' : '12px',
                        background: cadastrosOpen
                          ? 'linear-gradient(90deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))'
                          : 'transparent',
                        color: cadastrosOpen ? '#10b981' : '#64748b',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: cadastrosOpen ? 600 : 400,
                        transition: 'all 0.2s ease',
                        borderLeft: cadastrosOpen ? '3px solid #10b981' : '3px solid transparent',
                        justifyContent: showLabel ? 'space-between' : 'center',
                        whiteSpace: 'nowrap',
                        width: '100%',
                        minHeight: isMobile ? '48px' : 'auto',
                      }}
                      onMouseEnter={e => {
                        if (!cadastrosOpen) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                          e.currentTarget.style.color = '#94a3b8';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!cadastrosOpen) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#64748b';
                        }
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaFolder size={17} />
                        {showLabel && <span>Cadastros</span>}
                      </span>
                      {showLabel && (cadastrosOpen
                        ? <FaChevronUp size={12} />
                        : <FaChevronDown size={12} />
                      )}
                    </button>

                    {/* Sub-items */}
                    {cadastrosOpen && showLabel && (
                      <div style={{
                        display: 'flex', flexDirection: 'column', gap: '2px',
                        marginLeft: '12px', paddingLeft: '16px',
                        borderLeft: '1px solid #1e293b',
                        marginBottom: '4px',
                      }}>
                        {subItems.map(sub => {
                          const subActive = currentPath === sub.path;
                          return (
                            <button
                              key={sub.path}
                              type="button"
                              onClick={() => navigate(sub.path)}
                              style={{
                                background: subActive ? 'rgba(16,185,129,0.1)' : 'transparent',
                                color: subActive ? '#10b981' : '#64748b',
                                border: 'none', borderRadius: '6px',
                                padding: '8px 10px', textAlign: 'left',
                                cursor: 'pointer', fontSize: '13px',
                                fontWeight: subActive ? 600 : 400,
                                transition: 'all 0.2s',
                                width: '100%',
                                minHeight: isMobile ? '48px' : 'auto',
                              }}
                              onMouseEnter={e => {
                                if (!subActive) {
                                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                  e.currentTarget.style.color = '#94a3b8';
                                }
                              }}
                              onMouseLeave={e => {
                                if (!subActive) {
                                  e.currentTarget.style.background = 'transparent';
                                  e.currentTarget.style.color = '#64748b';
                                }
                              }}
                            >
                              {sub.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* ── Footer ── */}
        {(isOpen || isMobile) && (
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #1e293b',
            fontSize: '11px', color: '#334155',
            textAlign: 'center',
          }}>
            © {new Date().getFullYear()} FIITrack
          </div>
        )}
      </div>
    </>
  );
}

export default Sidebar;
