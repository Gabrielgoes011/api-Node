import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TableAcoes } from '../../../components/TableAcoes';
import { useUsuarios } from '../../../hooks/useUsuarios';
import ModalFormulario from '../../../components/ModalFormulario/ModalFormulario';
import ModalConfirmacao from '../../../components/ModalDeConfirmacao/ModalConfirmacao';

// Definição das colunas da tabela
const colunasUsuarios = [
  { titulo: 'Nome', acesso: 'nome', width: '25%', align: 'left' },
  { titulo: 'Email', acesso: 'email', width: '30%', align: 'left' },
  { titulo: 'Data Nascimento', acesso: 'dataNascimento', width: '20%', align: 'center' },
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
    dashboard,
    getUsers,
    getDashboard,
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
    getDashboard();
  }, [getUsers, getDashboard]);

  // Handler para o submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações
    if (!formData.nome || !formData.email || !formData.dataNascimento || !formData.cpf) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    // Validação da data de nascimento (DD/MM/AAAA)
    const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dataRegex.test(formData.dataNascimento)) {
      alert('Data de nascimento deve estar no formato DD/MM/AAAA');
      return;
    }

    // Submeter
    if (onEdit) {
      await handleUpdateUser({
        nome: formData.nome,
        dataNascimento: formData.dataNascimento,
        email: formData.email,
        cpf: formData.cpf,
        status: onEdit.status || 'on'
      });
    } else {
      await handleAddUser(formData);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', color: '#0f172a', fontFamily: 'Inter, sans-serif', padding: '2rem 1rem' }}>
      <main style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.25rem' }}>Cadastro de Usuários</h1>
            <p style={{ color: '#475569', margin: 0 }}>Gerencie usuários ativos e inativos com ações rápidas e filtros</p>
          </div>
          <button
            onClick={handleOpenCreate}
            style={{
              padding: '0.65rem 1.1rem',
              backgroundColor: '#1d4ed8',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(30,64,175,0.2)'
            }}
          >
            + Novo Usuário
          </button>
        </header>

        {/* Cards de métricas */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1rem', boxShadow: '0 1px 4px rgba(15,23,42,0.08)' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Usuários Ativos</p>
            <h2 style={{ margin: '0.4rem 0', fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>{dashboard.ativos}</h2>
          </div>
          <div style={{ background: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1rem', boxShadow: '0 1px 4px rgba(15,23,42,0.08)' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Usuários Inativos</p>
            <h2 style={{ margin: '0.4rem 0', fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>{dashboard.inativos}</h2>
          </div>
          <div style={{ background: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1rem', boxShadow: '0 1px 4px rgba(15,23,42,0.08)' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Total de Usuários</p>
            <h2 style={{ margin: '0.4rem 0', fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>{dashboard.total}</h2>
          </div>
        </section>

        {/* Abas de filtros */}
        <nav style={{ display: 'flex', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '1rem' }}>
          {['ativos', 'inativos'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                backgroundColor: activeTab === tab ? '#ffffff' : '#f8fafc',
                color: activeTab === tab ? '#1d4ed8' : '#64748b',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid #1d4ed8' : '3px solid transparent',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {tab === 'ativos' ? 'Ativos' : 'Inativos'}
            </button>
          ))}
        </nav>

        {/* Tabela de usuários */}
        <section style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(15,23,42,0.08)', padding: '1rem' }}>
          {users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              Nenhum usuário encontrado.
            </div>
          ) : (
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
              paddingHead="14px 12px"
              paddingBody="13px 12px"
              tamanhoIcones="fs-5"
              tamanhoFontBody="14px"
              tamanhoFontHead="14px"
            />
          )}

          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
            Exibindo usuários {activeTab === 'ativos' ? 'ativos' : 'inativos'}.
          </div>
        </section>

        {/* Modais */}
        {showFormModal && (
          <ModalFormulario
            onClose={closeFormModal}
            onSubmit={handleSubmit}
            isEditing={!!onEdit}
            formData={formData}
            setFormData={setFormData}
          />
        )}

        {showModal && (
          <ModalConfirmacao
            onClose={() => setShowModal(false)}
            onConfirm={executeConfirmedAction}
            action={modalAction}
            userName={userSelected?.nome}
          />
        )}

      </main>

      <ToastContainer autoClose={3000} position="top-right" />
    </div>
  );
}

export default PaginaUsuarios;
