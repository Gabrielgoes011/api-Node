import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import TableAcoes from '../../../components/TableAcoes/TableAcoes';

function PaginaSeguimentos() {
  // Estados da Página
  const [seguimentos, setSeguimentos] = useState([]);
  const [onEdit, setOnEdit] = useState(null);
  const [nome, setNome] = useState('');

  // Estados dos Modais
  const [showFormModal, setShowFormModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [itemSelected, setItemSelected] = useState(null);
  const [modalAction, setModalAction] = useState('');

  // Busca dos dados na API
  const getSeguimentos = useCallback(async () => {
    try {
      // Quando criar a API, essa será a rota que listará os segmentos
      const res = await axios.get("http://localhost:3000/seguimentos");
      setSeguimentos(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
    } catch (error) {
      // Descomente abaixo após o Backend estar pronto:
      // toast.error(error.message || "Erro ao buscar segmentos");
    }
  }, []);

  useEffect(() => {
    getSeguimentos();
  }, [getSeguimentos]);

  // Controles do Modal de Formulário
  const handleOpenCreate = () => {
    setOnEdit(null);
    setNome('');
    setShowFormModal(true);
  };

  const handleEdit = (item) => {
    setOnEdit(item);
    setNome(item.nome);
    setShowFormModal(true);
  };

  // Controles do Modal de Confirmação (Exclusão)
  const handleOpenModal = (item, action) => {
    setItemSelected(item);
    setModalAction(action);
    setShowModal(true);
  };

  const executeConfirmedAction = async () => {
    if (!itemSelected) return;

    if (modalAction === 'delete') {
      try {
        const { data } = await axios.delete("http://localhost:3000/seguimentos/delete/" + itemSelected.id);
        const newArray = seguimentos.filter((item) => item.id !== itemSelected.id);
        setSeguimentos(newArray);
        toast.success(data.message || "Segmento excluído com sucesso!");
      } catch (error) {
        toast.error(error.response?.data || "Erro ao excluir segmento");
      }
    }

    setShowModal(false);
    setItemSelected(null);
    setModalAction('');
  };

  // Envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome) {
      toast.warn("Por favor, preencha o nome do segmento!");
      return;
    }

    if (onEdit) {
      try {
        const { data } = await axios.put("http://localhost:3000/seguimentos/update/" + onEdit.id, { nome });
        toast.success(data.message || "Segmento atualizado com sucesso!");
        setNome('');
        setOnEdit(null);
        getSeguimentos();
        setShowFormModal(false);
      } catch (error) {
        toast.error(error.response?.data?.error || error.response?.data || "Erro ao atualizar segmento");
      }
    } else {
      try {
        const { data } = await axios.post("http://localhost:3000/seguimentos", { nome });
        toast.success(data.message || "Segmento cadastrado com sucesso!");
        setNome('');
        setOnEdit(null);
        getSeguimentos();
        setShowFormModal(false);
      } catch (error) {
        toast.error(error.response?.data?.error || error.response?.data || "Erro ao cadastrar segmento");
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', fontFamily: 'Arial', minHeight: '100vh', marginTop: '60px' }}>

      {/* Cabeçalho */}
      <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#333', margin: 0 }}>Gerenciamento de Segmentos</h2>
        <button onClick={handleOpenCreate} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          + Novo Segmento
        </button>
      </div>

      {/* Card de Contagem */}
      <div style={{ width: '100%', maxWidth: '1000px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', display: 'inline-block', minWidth: '200px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '16px' }}>Total de Segmentos</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>{seguimentos.length}</p>
        </div>
      </div>

      {/* Tabela de Segmentos */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '100%', maxWidth: '1000px' }}>
        <TableAcoes
          coluna={[
            { titulo: 'Segmento', acesso: 'nome' }
          ]}
          data={seguimentos}
          itemsPerPage={10}
          usaEditar={true}
          acaoEditar={handleEdit}
          usaExcluir={true}
          acaoExcluir={(row) => handleOpenModal(row, 'delete')}
        />
      </div>

      {/* Modal de Formulário (Cadastro/Edição) */}
      {showFormModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', width: '90%', maxWidth: '400px', position: 'relative' }}>
            <button onClick={() => setShowFormModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#999' }}>✖</button>
            <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>{onEdit ? 'Editar Segmento' : 'Novo Segmento'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Nome do Segmento" value={nome} onChange={(e) => setNome(e.target.value)} style={{ padding: '12px', fontSize: '16px', width: '100%', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', width: '100%', fontWeight: 'bold', marginTop: '10px' }}>
                {onEdit ? "Salvar Alterações" : "Cadastrar"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
          <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Confirmação</h3>
            <p style={{ marginBottom: '25px', fontSize: '16px', color: '#555' }}> Você tem certeza que quer <strong>excluir</strong> o segmento <strong>{itemSelected?.nome}</strong>? </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
              <button onClick={executeConfirmedAction} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer autoClose={3000} position="top-right" />
    </div>
  );
}

export default PaginaSeguimentos;
