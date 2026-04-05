import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const seguimentosService = {
  // Listar todos os segmentos
  listarTodos: async () => {
    try {
      const res = await axios.get(`${API_URL}/seguimentos`);
      // Tratamento temporário caso a API retorne a contagem em vez de array neste momento
      if (!Array.isArray(res.data)) {
        return [];
      }
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Criar novo segmento
  criar: async (seguimentoData) => {
    try {
      const res = await axios.post(`${API_URL}/seguimentos`, seguimentoData);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Atualizar segmento
  atualizar: async (id, seguimentoData) => {
    try {
      const res = await axios.put(`${API_URL}/seguimentos/update/${id}`, seguimentoData);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Inativar/Reativar segmento
  inativarReativar: async (id) => {
    try {
      const res = await axios.put(`${API_URL}/seguimentos/inativaReativa/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Excluir segmento
  excluir: async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/seguimentos/delete/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Contagem de segmentos para dashboard
  contar: async () => {
    try {
      const res = await axios.get(`${API_URL}/seguimentos/contar`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
};