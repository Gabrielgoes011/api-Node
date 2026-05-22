import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import TopBar from '../TopBar/TopBar';
import useBreakpoint from '../../hooks/useBreakpoint';

function Layout({ children, onLogout }) {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const location = useLocation();

  // On mobile the sidebar starts closed (Req 2.2); on desktop it starts open.
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // When the breakpoint switches to mobile, close the sidebar (Req 2.2).
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  // Close sidebar on route change when mobile (Req 2.8).
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  // Content margin: 0 on mobile (sidebar is an overlay), 250px/0 on desktop (Req 2.8, 2.9).
  const contentMarginLeft = isMobile ? '0px' : (sidebarOpen ? '250px' : '0px');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1e' }}>

      {/* Sidebar lateral */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        onLogout={onLogout}
      />

      {/* Barra superior fixa */}
      <TopBar sidebarOpen={sidebarOpen} onLogout={onLogout} />

      {/* Conteúdo principal */}
      <div style={{
        marginLeft: contentMarginLeft,
        flex: 1,
        background: '#0a0f1e',
        minHeight: '100vh',
        position: 'relative',
        transition: 'margin-left 0.3s ease',
        paddingTop: '60px',
      }}>
        <div style={{
          padding: isMobile ? '16px' : isTablet ? '20px' : '24px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          {children}
        </div>
      </div>

    </div>
  );
}

export default Layout;
