import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const seguimentosService = {
  // Listar todos os seguimentos
  listarTodos: async () => {
    try {
      const res = await axios.get(`${API_URL}/seguimentos`);
      if (!Array.isArray(res.data)) {
        return [];
      }
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Criar novo seguimento
  criar: async (seguimentoData) => {
    try {
      const res = await axios.post(`${API_URL}/seguimentos`, seguimentoData);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Atualizar seguimento
  atualizar: async (id, seguimento) => {
    try {
      const res = await axios.put(`${API_URL}/seguimentos/update`, { 
        idSeguimento: id, 
        nome: seguimento.nome || seguimento 
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Inativar/Reativar seguimento
  inativarReativar: async (id) => {
    try {
      const res = await axios.put(`${API_URL}/seguimentos/inativaReativa/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Excluir seguimento
  excluir: async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/seguimentos/delete/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Contagem de seguimentos para dashboard
  contar: async () => {
    try {
      const res = await axios.get(`${API_URL}/seguimentos/contar`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
};