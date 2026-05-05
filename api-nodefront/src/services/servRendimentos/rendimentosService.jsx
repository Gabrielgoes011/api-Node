import api from '../../config/api';

export const rendimentosService = {
  // Listar rendimentos por ano (e opcionalmente mês)
  listar: async ({ mes, ano }) => {
    try {
      const res = await api.post('/rendimentos', { mes, ano });
      if (!Array.isArray(res.data)) {
        return [];
      }
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};
