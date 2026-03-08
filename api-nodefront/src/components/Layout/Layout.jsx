import React from 'react';
import Sidebar from '../Sidebar/Sidebar';

function Layout({ currentPage, onNavigate, children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

      {/* Main Content */}
      <div style={{
        marginLeft: '250px',
        flex: 1,
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
        position: 'relative'
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
