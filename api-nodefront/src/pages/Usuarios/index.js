import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TableAcoes } from '../../components/TableAcoes';
import { useUsuarios } from '../../hooks/useUsuarios';
import ModalFormulario from '../../components/ModalFormulario/ModalFormulario';
import ModalConfirmacao from '../../components/ModalDeConfirmacao/ModalConfirmacao';

// Definição das colunas da tabela
const colunasUsuarios = [
  { titulo: 'Nome', acesso: 'nome', width: '25%', align: 'left' },
  { titulo: 'Email', acesso: 'email', width: '30%', align: 'left' },
  { titulo: 'Idade', acesso: 'idade', width: '15%', align: 'center' },
  { titulo: 'CPF', acesso: 'cpf', width: '20%', align: 'center' }
];

function PaginaUsuarios() {
  const {
    users,
    onEdit,
    activeTab,
    formData,
    showModal,
    userSelected,
    modalAction,
    showFormModal,
    setFormData,
    setActiveTab,
    setShowModal,
    getUsers,
    handleAddUser,
    handleUpdateUser,
    handleOpenCreate,
    handleEdit,
    handleOpenModal,
    executeConfirmedAction,
    closeFormModal
  } = useUsuarios();

  // Carregar usuários na primeira montagem
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Handler para o submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações
    if (!formData.nome || !formData.email || !formData.idade || !formData.cpf) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    if (!onEdit && (!formData.senha || !formData.confirmaSenha)) {
      alert('Por favor, preencha a senha e a confirmação!');
      return;
    }

    // Submeter
    if (onEdit) {
      await handleUpdateUser({
        nome: formData.nome,
        idade: formData.idade,
        email: formData.email,
        cpf: formData.cpf,
        status: onEdit.status || 'on'
      });
    } else {
      await handleAddUser(formData);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', fontFamily: 'Arial' }}>

      {/* Cabeçalho */}
      <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#333', margin: 0 }}>Gerenciamento de Usuários</h2>
        <button
          onClick={handleOpenCreate}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          + Novo Usuário
        </button>
      </div>

      {/* Abas */}
      <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', marginBottom: '0', borderBottom: '1px solid #ccc' }}>
        <button
          onClick={() => setActiveTab('ativos')}
          style={{
            padding: '12px 25px',
            cursor: 'pointer',
            background: activeTab === 'ativos' ? '#fff' : '#e9ecef',
            border: '1px solid #ccc',
            borderBottom: activeTab === 'ativos' ? 'none' : '1px solid #ccc',
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            color: activeTab === 'ativos' ? '#007bff' : '#666',
            fontWeight: 'bold',
            marginRight: '5px',
            position: 'relative',
            top: '1px'
          }}
        >
          Ativos
        </button>
        <button
          onClick={() => setActiveTab('inativos')}
          style={{
            padding: '12px 25px',
            cursor: 'pointer',
            background: activeTab === 'inativos' ? '#fff' : '#e9ecef',
            border: '1px solid #ccc',
            borderBottom: activeTab === 'inativos' ? 'none' : '1px solid #ccc',
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            color: activeTab === 'inativos' ? '#007bff' : '#666',
            fontWeight: 'bold',
            position: 'relative',
            top: '1px'
          }}
        >
          Inativos
        </button>
      </div>

      {/* Tabela de Usuários */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '0px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '100%', maxWidth: '1000px' }}>
        {users.length > 0 ? (
          <TableAcoes
            coluna={colunasUsuarios}
            data={users}
            itemsPerPage={10}
            labelpesquisa="Buscar usuários..."
            usaVisualizar={false}
            usaEditar={activeTab === 'ativos'}
            acaoEditar={handleEdit}
            usaExcluir={true}
            acaoExcluir={(user) => handleOpenModal(user, 'delete')}
            usaResetarSenha={activeTab === 'ativos'}
            acaoResetarSenha={(user) => handleOpenModal(user, 'reset')}
            usaInativar={activeTab === 'ativos'}
            acaoInativar={(user) => handleOpenModal(user, 'inactivate')}
            usaReativar={activeTab === 'inativos'}
            acaoReativar={(user) => handleOpenModal(user, 'reactivate')}
            paddingHead="12px 15px"
            paddingBody="12px 15px"
            tamanhoIcones="fs-5"
            tamanhoFontBody="14px"
            tamanhoFontHead="14px"
          />
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <p>Nenhum usuário encontrado.</p>
          </div>
        )}
      </div>

      {/* Modal de Formulário */}
      {showFormModal && (
        <ModalFormulario
          onClose={closeFormModal}
          onSubmit={handleSubmit}
          isEditing={!!onEdit}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {/* Modal de Confirmação */}
      {showModal && (
        <ModalConfirmacao
          onClose={() => setShowModal(false)}
          onConfirm={executeConfirmedAction}
          action={modalAction}
          userName={userSelected?.nome}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer autoClose={3000} position="top-right" />
    </div>
  );
}

export default PaginaUsuarios;
