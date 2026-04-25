import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import PaginaDashboard from './pages/Dashboard';
import PaginaUsuarios from './pages/cadastros/usuarios';
import PaginaConfiguracoes from './pages/Configuracoes';
import PaginaControleAtivos from './pages/controleAtivos/controleAtivos';
import PaginaRendimentos from './pages/rendimentos/rendimentos';
import PaginaPrecificacao from './pages/precificacao/precificacao';
import PaginaOperacoes from './pages/operacoes/operacoes';
import PaginaRelatorios from './pages/relatorios/relatorios';
import PaginaSeguimentos from './pages/cadastros/seguimentos/seguimentos';
import PaginaMeusFiis from './pages/cadastros/meusFundos/meusFiis';

import './styles/global.css';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PaginaDashboard />} />
        <Route path="/controle-ativos" element={<PaginaControleAtivos />} />
        <Route path="/operacoes" element={<PaginaOperacoes />} />
        <Route path="/precificacao" element={<PaginaPrecificacao />} />
        <Route path="/rendimentos" element={<PaginaRendimentos />} />
        <Route path="/relatorios" element={<PaginaRelatorios />} />
        <Route path="/configuracoes" element={<PaginaConfiguracoes />} />
        <Route path="/cadastros/usuarios" element={<PaginaUsuarios />} />
        <Route path="/cadastros/seguimentos" element={<PaginaSeguimentos />} />
        <Route path="/cadastros/meusfiis" element={<PaginaMeusFiis />} />
        <Route path="/operacao" element={<Navigate to="/operacoes" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
