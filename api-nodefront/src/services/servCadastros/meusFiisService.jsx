import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const meusFiisService = {
  // Listar todos os FIIs
  listarTodos: async () => {
    try {
      const res = await axios.get(`${API_URL}/meusFundos`);
      if (!Array.isArray(res.data)) {
        return [];
      }
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Criar novo FII
  criar: async (fiiData) => {
    try {
      const res = await axios.post(`${API_URL}/meusFundos`, fiiData);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Atualizar FII
  atualizar: async (id, fiiData) => {
    try {
      const res = await axios.put(`${API_URL}/meus-fiis/update/${id}`, fiiData);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Excluir FII
  excluir: async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/meus-fiis/delete/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Contagem de FIIs
  contar: async () => {
    try {
      const res = await axios.get(`${API_URL}/meusFundos/contar`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
};