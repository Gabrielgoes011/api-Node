import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TableAcoes } from '../../../components/TableAcoes';
import { useSeguimentos } from '../../../hooks/hooksCadastros/useSeguimentos';
import ModalConfirmacao from '../../../components/ModalDeConfirmacao/ModalConfirmacao';

// Definição das colunas da tabela
const colunasSeguimentos = [
  { titulo: 'Seguimento', acesso: 'nome', width: '100', align: 'center' }
];

function PaginaSeguimentos() {
  const {
    seguimentos,
    onEdit,
    formData,
    showModal,
    itemSelected,
    modalAction,
    showFormModal,
    setFormData,
    setShowModal,
    dashboard,
    getSeguimentos,
    getDashboard,
    handleAddSeguimento,
    handleUpdateSeguimento,
    handleOpenCreate,
    handleEdit,
    handleOpenModal,
    executeConfirmedAction,
    closeFormModal
  } = useSeguimentos();

  // Carregar segmentos na primeira montagem
  useEffect(() => {
    getSeguimentos();
    getDashboard();
  }, [getSeguimentos, getDashboard]);

  // Handler para o submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações
    if (!formData.nome) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    // Submeter
    if (onEdit) {
      await handleUpdateSeguimento({
        nome: formData.nome
      });
    } else {
      await handleAddSeguimento(formData);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', color: '#0f172a', fontFamily: 'Inter, sans-serif', padding: '2rem 1rem' }}>
      <main style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div>            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.25rem' }}>Cadastro de Seguimentos</h1>
            <p style={{ color: '#475569', margin: 0 }}>Gerencie seguimentos com ações rápidas e filtros</p>
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
            + Cadastrar Novo Seguimento
          </button>
        </header>

        {/* Cards de métricas */}
        <section style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ minWidth: '250px', background: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1rem', boxShadow: '0 1px 4px rgba(15,23,42,0.08)' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Total de Seguimentos</p>
            <h2 style={{ margin: '0.4rem 0', fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>{dashboard.total}</h2>
          </div>
        </section>

        {/* Tabela de segmentos */}
        <section style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(15,23,42,0.08)', padding: '1rem' }}>
          {seguimentos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              Nenhum seguimento encontrado.
            </div>
          ) : (
            <TableAcoes
              coluna={colunasSeguimentos}
              data={seguimentos}
              itemsPerPage={10}
              labelpesquisa="Buscar seguimentos..."
              usaVisualizar={false}
              usaEditar={true}
              acaoEditar={handleEdit}
              usaExcluir={true}
              acaoExcluir={(item) => handleOpenModal(item, 'delete')}
              usaResetarSenha={false}
              usaInativar={false}
              acaoInativar={(item) => handleOpenModal(item, 'inactivate')}
              usaReativar={false}
              acaoReativar={(item) => handleOpenModal(item, 'reactivate')}
              paddingHead="14px 12px"
              paddingBody="13px 12px"
              tamanhoIcones="fs-5"
              tamanhoFontBody="14px"
              tamanhoFontHead="14px"
            />
          )}
        </section>

        {/* Modais */}
        {showFormModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '90%', maxWidth: '400px', position: 'relative' }}>
              <button onClick={closeFormModal} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}>✖</button>

              <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1e3b28', fontSize: '1.5rem', fontWeight: 700 }}>
                {onEdit ? "Editar Seguimento" : "Cadastrar Seguimento"}
              </h2>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="Nome do Seguimento"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  style={{ padding: '0.75rem 1rem', fontSize: '1rem', width: '100%', boxSizing: 'border-box', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', color: '#334155' }}
                  autoFocus
                />

                <button type="submit" style={{ padding: '0.75rem', backgroundColor: 'hsl(120, 76%, 48%)', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, marginTop: '0.5rem', transition: 'background-color 0.2s' }}>
                  {onEdit ? "Salvar Alterações" : "Cadastrar"}
                </button>
              </form>
            </div>
          </div>
        )}

        {showModal && (
          <ModalConfirmacao
            onClose={() => setShowModal(false)}
            onConfirm={executeConfirmedAction}
            action={modalAction}
            userName={itemSelected?.nome}
          />
        )}

      </main>

      <ToastContainer autoClose={3000} position="top-right" />
    </div>
  );
}

export default PaginaSeguimentos;
