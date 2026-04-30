import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const usuariosService = {
  // Listar todos os usuários
  listarTodos: async (status = 'on') => {
    try {
      const res = await axios.get(`${API_URL}/users?status=${status}`);
      if (!Array.isArray(res.data)) {
        throw new Error('Resposta da API não é um array');
      }
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Criar novo usuário
  criar: async (usuarioData) => {
    try {
      const res = await axios.post(`${API_URL}/cadUsers`, usuarioData);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Atualizar usuário
  atualizar: async (id, usuarioData) => {
    try {
      const res = await axios.put(`${API_URL}/users/update/${id}`, usuarioData);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Inativar/Reativar usuário
  inativarReativar: async (id) => {
    try {
      const res = await axios.put(`${API_URL}/inativaUser/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Contagem de usuários para dashboard
  contar: async () => {
    try {
      const res = await axios.get(`${API_URL}/users/dash/count`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Deletar usuário
  deletar: async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/users/delete/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
};
