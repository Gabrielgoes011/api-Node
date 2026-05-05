import api from '../../config/api';

export const usuariosService = {
  listarTodos: async (status = 'on') => {
    try {
      const res = await api.get(`/users?status=${status}`);
      if (!Array.isArray(res.data)) throw new Error('Resposta da API não é um array');
      return res.data;
    } catch (error) { throw error; }
  },
  criar: async (usuarioData) => {
    try {
      const res = await api.post('/cadUsers', usuarioData);
      return res.data;
    } catch (error) { throw error; }
  },
  atualizar: async (id, usuarioData) => {
    try {
      const res = await api.put(`/users/update/${id}`, usuarioData);
      return res.data;
    } catch (error) { throw error; }
  },
  inativarReativar: async (id) => {
    try {
      const res = await api.put(`/inativaUser/${id}`);
      return res.data;
    } catch (error) { throw error; }
  },
  contar: async () => {
    try {
      const res = await api.get('/users/dash/count');
      return res.data;
    } catch (error) { throw error; }
  },
  deletar: async (id) => {
    try {
      const res = await api.delete(`/users/delete/${id}`);
      return res.data;
    } catch (error) { throw error; }
  }
};
