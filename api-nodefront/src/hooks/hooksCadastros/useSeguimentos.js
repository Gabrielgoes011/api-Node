import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { seguimentosService } from '../../services/servCadastros/seguimentosService';

export const useSeguimentos = () => {
  const [seguimentos, setSeguimentos] = useState([]);
  const [dashboard, setDashboard] = useState({ total: 0 });

  const [onEdit, setOnEdit] = useState(null);
  const [formData, setFormData] = useState({ nome: '' });
  const [showFormModal, setShowFormModal] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [itemSelected, setItemSelected] = useState(null);
  const [modalAction, setModalAction] = useState('');

  const getSeguimentos = useCallback(async () => {
    try {
      const data = await seguimentosService.listarTodos();
      setSeguimentos(data || []);
    } catch (error) {
      console.error('Erro ao buscar segmentos:', error);
      // toast.error('Erro ao buscar segmentos');
    }
  }, []);

  const getDashboard = useCallback(async () => {
    try {
      const data = await seguimentosService.contar();
      const totalCount = Array.isArray(data) ? data.length : (Number(data.total) || Number(data.ativos) || 0);
      setDashboard({
        total: totalCount
      });
    } catch (error) {
      console.error('Erro ao buscar dashboard:', error);
    }
  }, []);

  const handleAddSeguimento = async (data) => {
    try {
      await seguimentosService.criar(data);
      toast.success('Seguimento cadastrado com sucesso!');
      closeFormModal();
      getSeguimentos();
      getDashboard();
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data || 'Erro ao cadastrar seguimento.');
    }
  };

  const handleUpdateSeguimento = async (data) => {
    try {
      await seguimentosService.atualizar(onEdit.id, data);
      toast.success('Seguimento atualizado com sucesso!');
      closeFormModal();
      getSeguimentos();
      getDashboard();
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data || 'Erro ao atualizar seguimento.');
    }
  };

  const executeConfirmedAction = async () => {
    if (!itemSelected) return;

    try {
      if (modalAction === 'delete') {
        await seguimentosService.excluir(itemSelected.id);
        toast.success('Seguimento excluído com sucesso!');
      }
      getSeguimentos();
      getDashboard();
    } catch (error) {
      toast.error(error.response?.data?.error || `Erro ao excluir o seguimento.`);
    }

    setShowModal(false);
    setItemSelected(null);
    setModalAction('');
  };

  const handleOpenCreate = () => {
    setOnEdit(null);
    setFormData({ nome: '' });
    setShowFormModal(true);
  };

  const handleEdit = (item) => {
    setOnEdit(item);
    setFormData({ nome: item.nome });
    setShowFormModal(true);
  };

  const handleOpenModal = (item, action) => {
    setItemSelected(item);
    setModalAction(action);
    setShowModal(true);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setOnEdit(null);
    setFormData({ nome: '' });
  };

  return { seguimentos, onEdit, formData, showModal, itemSelected, modalAction, showFormModal, setFormData, setShowModal, dashboard, getSeguimentos, getDashboard, handleAddSeguimento, handleUpdateSeguimento, handleOpenCreate, handleEdit, handleOpenModal, executeConfirmedAction, closeFormModal };
};