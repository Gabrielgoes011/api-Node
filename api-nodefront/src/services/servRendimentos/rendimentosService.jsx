import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const rendimentosService = {
  // Listar rendimentos por ano (e opcionalmente mês)
  listar: async ({ mes, ano }) => {
    try {
      const res = await axios.post(`${API_URL}/rendimentos`, { mes, ano });
      if (!Array.isArray(res.data)) {
        return [];
      }
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};
