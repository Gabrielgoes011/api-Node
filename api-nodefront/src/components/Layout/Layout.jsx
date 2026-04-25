import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />

      {/* Main Content */}
      <div style={{
        marginLeft: sidebarOpen ? '250px' : '0px',
        flex: 1,
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
        position: 'relative',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Conteúdo da Página */}
        <div style={{
          padding: '20px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
