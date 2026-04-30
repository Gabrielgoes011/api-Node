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
          Dashboard de Ativos 👋
        </h1>

        <p style={{
          fontSize: '24px',
          color: '#7f8c8d',
          marginBottom: '40px',
          maxWidth: '600px',
          lineHeight: '1.6'
        }}>
          Bem-vindo ao gerenciador de Fundos Imobiliários. <br />
          Utilize o menu para controlar sua carteira, rendimentos e movimentações.
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
            <h3 style={{ color: '#3498db', marginBottom: '10px' }}>🏢 Carteira de FIIs</h3>
            <p style={{ color: '#7f8c8d' }}>Acompanhe seus fundos imobiliários e a evolução do seu patrimônio.</p>
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
            <h3 style={{ color: '#2ecc71', marginBottom: '10px' }}>💰 Rendimentos</h3>
            <p style={{ color: '#7f8c8d' }}>Controle os dividendos e proventos recebidos mensalmente.</p>
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
            <h3 style={{ color: '#e74c3c', marginBottom: '10px' }}>🔄 Compras e Vendas</h3>
            <p style={{ color: '#7f8c8d' }}>Registre e consulte o histórico de ordens executadas.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaginaDashboard;
