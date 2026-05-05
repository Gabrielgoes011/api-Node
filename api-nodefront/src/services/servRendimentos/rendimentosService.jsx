import api from '../../config/api';

export const rendimentosService = {
  // Listar rendimentos por ano (e opcionalmente mês)
  listar: async ({ mes, ano }) => {
    try {
      const res = await api.post('/rendimentos', { mes, ano });
      return Array.isArray(res.data) ? res.data : [];
    } catch (error) { throw error; }
  },

  // Carrega dados dos gráficos (mensal + anual) por ano
  dadosGrafico: async ({ ano }) => {
    try {
      const res = await api.post('/carregarGraficoDashboard', { ano });
      return res.data; // { detalheMensal: [], detalheAnual: [] }
    } catch (error) { throw error; }
  },
};
