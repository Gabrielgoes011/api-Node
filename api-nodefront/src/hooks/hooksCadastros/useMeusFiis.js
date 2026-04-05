import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { meusFiisService } from '../../services/servCadastros/meusFiisService';
import { seguimentosService } from '../../services/servCadastros/seguimentosService';

export const useMeusFiis = () => {
  const [fiis, setFiis] = useState([]);
  const [seguimentos, setSeguimentos] = useState([]);
  const [dashboard, setDashboard] = useState({ total: 0 });

  const [onEdit, setOnEdit] = useState(null);
  const [formData, setFormData] = useState({ ticker: '', nomeFundo: '', cnpj: '', idSegmento: '' });
  const [showFormModal, setShowFormModal] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [itemSelected, setItemSelected] = useState(null);
  const [modalAction, setModalAction] = useState('');

  const getFiis = useCallback(async () => {
    try {
      const data = await meusFiisService.listarTodos();
      setFiis(data || []);
    } catch (error) {
      console.error('Erro ao buscar FIIs:', error);
    }
  }, []);

  const getSeguimentos = useCallback(async () => {
    try {
      const data = await seguimentosService.listarTodos();
      setSeguimentos(data || []);
    } catch (error) {
      console.error('Erro ao buscar seguimentos:', error);
    }
  }, []);

  const getDashboard = useCallback(async () => {
    try {
      const data = await meusFiisService.contar();
      const totalCount = Array.isArray(data) ? data.length : (Number(data.total) || 0);
      setDashboard({ total: totalCount });
    } catch (error) {
      console.error('Erro ao buscar dashboard:', error);
    }
  }, []);

  const handleAddFii = async (data) => {
    try {
      await meusFiisService.criar(data);
      toast.success('Fundo cadastrado com sucesso!');
      closeFormModal();
      getFiis();
      getDashboard();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao cadastrar fundo.');
    }
  };

  const handleUpdateFii = async (data) => {
    try {
      await meusFiisService.atualizar(onEdit.id, data);
      toast.success('Fundo atualizado com sucesso!');
      closeFormModal();
      getFiis();
      getDashboard();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao atualizar fundo.');
    }
  };

  const executeConfirmedAction = async () => {
    if (!itemSelected) return;

    try {
      if (modalAction === 'delete') {
        await meusFiisService.excluir(itemSelected.id);
        toast.success('Fundo excluído com sucesso!');
      }
      getFiis();
      getDashboard();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao excluir o fundo.');
    }

    setShowModal(false);
    setItemSelected(null);
    setModalAction('');
  };

  const handleOpenCreate = () => {
    setOnEdit(null);
    setFormData({ ticker: '', nomeFundo: '', cnpj: '', idSegmento: '' });
    setShowFormModal(true);
  };

  const handleEdit = (item) => {
    setOnEdit(item);
    setFormData({
      ticker: item.ticker,
      nomeFundo: item.nomeFundo,
      cnpj: item.cnpj,
      idSegmento: item.idSegmento || ''
    });
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
    setFormData({ ticker: '', nomeFundo: '', cnpj: '', idSegmento: '' });
  };

  return {
    fiis, seguimentos, onEdit, formData, showModal, itemSelected, modalAction, showFormModal,
    setFormData, setShowModal, dashboard, getFiis, getDashboard, getSeguimentos,
    handleAddFii, handleUpdateFii, handleOpenCreate, handleEdit, handleOpenModal,
    executeConfirmedAction, closeFormModal
  };
};