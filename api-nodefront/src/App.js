import React, { useState } from 'react';
import Layout from './components/Layout/Layout';
import PaginaDashboard from './pages/Dashboard';
import PaginaUsuarios from './pages/Usuarios';
import PaginaConfiguracoes from './pages/Configuracoes';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <PaginaDashboard />;
      case 'usuarios':
        return <PaginaUsuarios />;
      case 'configuracoes':
        return <PaginaConfiguracoes />;
      default:
        return <PaginaDashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
