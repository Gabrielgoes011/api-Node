import React, { useState } from 'react';
import Layout from './components/Layout/Layout';
import PaginaDashboard from './pages/Dashboard';
import PaginaUsuarios from './pages/cadastros/Usuarios';
import PaginaConfiguracoes from './pages/Configuracoes';
import PaginaControleAtivos from './pages/controleAtivos/controleAtivos';
import PaginaRendimentos from './pages/rendimentos/rendimentos';
import PaginaPrecificacao from './pages/precificacao/precificacao';
import PaginaOperacoes from './pages/operacoes/operacoes';
import PaginaRelatorios from './pages/relatorios/relatorios';

import './styles/global.css';


function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <PaginaDashboard />;
      case 'ControleAtivos':
        return <PaginaControleAtivos />;
      case 'Rendimentos':
        return <PaginaRendimentos />;
      case 'Precificacao':
        return <PaginaPrecificacao />;
      case 'Operacoes':
        return <PaginaOperacoes />;
      case 'Relatorios':
        return <PaginaRelatorios />;
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
