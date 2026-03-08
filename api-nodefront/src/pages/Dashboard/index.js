import React from 'react';

function PaginaDashboard() {
  return (
    <div style={{ marginTop: '60px' }}>
      {/* Cabeçalho */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '500px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          color: '#2c3e50',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          Bem-vindo! 👋
        </h1>

        <p style={{
          fontSize: '24px',
          color: '#7f8c8d',
          marginBottom: '40px',
          maxWidth: '600px',
          lineHeight: '1.6'
        }}>
          Bem-vindo ao gerenciador de aplicação. <br />
          Use o menu lateral para navegar entre as funcionalidades.
        </p>

        {/* Cards de informações */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          maxWidth: '800px',
          marginTop: '50px'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease'
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ color: '#3498db', marginBottom: '10px' }}>👥 Usuários</h3>
            <p style={{ color: '#7f8c8d' }}>Gerencie todos os usuários do sistema</p>
          </div>

          <div style={{
            backgroundColor: '#fff',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease'
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ color: '#2ecc71', marginBottom: '10px' }}>⚙️ Configurações</h3>
            <p style={{ color: '#7f8c8d' }}>Ajuste as configurações da aplicação</p>
          </div>

          <div style={{
            backgroundColor: '#fff',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease'
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ color: '#e74c3c', marginBottom: '10px' }}>📊 Dashboard</h3>
            <p style={{ color: '#7f8c8d' }}>Acompanhe as métricas da aplicação</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaginaDashboard;
