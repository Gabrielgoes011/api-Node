import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { usuariosService } from '../services/usuariosService';

export const useUsuarios = () => {
  // Estado para armazenar a lista de usuários
  const [users, setUsers] = useState([]);
  const [onEdit, setOnEdit] = useState(null);
  const [activeTab, setActiveTab] = useState('ativos');
  const [loading, setLoading] = useState(false);

  // Estados para o formulário
  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    email: '',
    cpf: '',
    foto: null
  });

  const [dashboard, setDashboard] = useState({
    ativos: 0,
    inativos: 0,
    total: 0
  });

  // Estados para o modal de confirmação
  const [showModal, setShowModal] = useState(false);
  const [userSelected, setUserSelected] = useState(null);
  const [modalAction, setModalAction] = useState(''); // 'delete', 'reset', 'inactivate', 'reactivate'

  // Estados para o modal do formulário
  const [showFormModal, setShowFormModal] = useState(false);

  // Função para buscar usuários
  const getUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Passa o status baseado na aba ativa
      const status = activeTab === 'ativos' ? 'on' : 'off';
      const allUsers = await usuariosService.listarTodos(status);

      // Mapeia o campo 'ativo' do banco para 'status' que o frontend usa
      const processedUsers = allUsers.map(user => ({
        ...user,
        status: user.ativo ? 'on' : 'off'
      })).sort((a, b) => (a.nome > b.nome ? 1 : -1));

      setUsers(processedUsers);
    } catch (error) {
      toast.error('Erro ao carregar usuários');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  // Função para buscar contagem do dashboard
  const getDashboard = useCallback(async () => {
    try {
      const result = await usuariosService.contar();
      setDashboard({
        ativos: result.ativos ?? 0,
        inativos: result.inativos ?? 0,
        total: result.total ?? 0
      });
    } catch (error) {
      toast.error('Erro ao carregar contagem de usuários');
      console.error(error);
    }
  }, []);

  // Adicionar usuário
  const handleAddUser = async (novoUsuario) => {
    try {
      await usuariosService.criar(novoUsuario);
      toast.success('Usuário cadastrado com sucesso!');
      getUsers();
      resetForm();
      setShowFormModal(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao cadastrar');
    }
  };

  // Atualizar usuário
  const handleUpdateUser = async (usuarioAtualizado) => {
    try {
      await usuariosService.atualizar(onEdit.id, usuarioAtualizado);
      toast.success('Usuário atualizado com sucesso!');
      getUsers();
      resetForm();
      setShowFormModal(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao atualizar');
    }
  };

  // Deletar usuário
  const handleDeleteUser = async (userId) => {
    try {
      await usuariosService.deletar(userId);
      toast.success('Usuário deletado com sucesso!');
      getUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao deletar');
    }
  };

  // Inativar usuário
  const handleInactivateUser = async (user) => {
    try {
      await usuariosService.inativarReativar(user.id);
      toast.success('Usuário inativado com sucesso!');
      getUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao inativar');
    }
  };

  // Reativar usuário
  const handleReactivateUser = async (user) => {
    try {
      await usuariosService.inativarReativar(user.id);
      toast.success('Usuário reativado com sucesso!');
      getUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao reativar');
    }
  };

  // Abrir modal em modo de criação
  const handleOpenCreate = () => {
    setOnEdit(null);
    resetForm();
    setShowFormModal(true);
  };

  // Abrir modal em modo de edição
  const handleEdit = (user) => {
    setOnEdit(user);
    setFormData({
      nome: user.nome,
      dataNascimento: user.dataNascimento || '',
      email: user.email,
      cpf: user.cpf,
      foto: user.foto || null
    });
    setShowFormModal(true);
  };

  // Abrir modal de confirmação
  const handleOpenModal = (user, action) => {
    setUserSelected(user);
    setModalAction(action);
    setShowModal(true);
  };

  // Executar ação confirmada no modal
  const executeConfirmedAction = async () => {
    if (!userSelected) return;

    switch (modalAction) {
      case 'delete':
        await handleDeleteUser(userSelected.id);
        break;
      case 'inactivate':
        await handleInactivateUser(userSelected);
        break;
      case 'reactivate':
        await handleReactivateUser(userSelected);
        break;
      case 'reset':
        toast.info('Rota de resetar senha será implementada');
        break;
      default:
        break;
    }

    setShowModal(false);
    setUserSelected(null);
    setModalAction('');
  };

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      nome: '',
      dataNascimento: '',
      email: '',
      cpf: '',
      foto: null
    });
  };

  // Fechar modal do formulário
  const closeFormModal = () => {
    setShowFormModal(false);
    resetForm();
    setOnEdit(null);
  };

  return {
    // Estados
    users,
    onEdit,
    activeTab,
    loading,
    formData,
    showModal,
    userSelected,
    modalAction,
    showFormModal,

    // Setters
    setFormData,
    setActiveTab,
    setShowModal,
    setShowFormModal,

    // Métricas
    dashboard,

    // Métodos
    getUsers,
    getDashboard,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
    handleInactivateUser,
    handleReactivateUser,
    handleOpenCreate,
    handleEdit,
    handleOpenModal,
    executeConfirmedAction,
    closeFormModal,
    resetForm
  };
};
