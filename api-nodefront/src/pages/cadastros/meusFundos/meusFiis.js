import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TableAcoes } from '../../../components/TableAcoes';
import { useMeusFiis } from '../../../hooks/hooksCadastros/useMeusFiis';
import ModalConfirmacao from '../../../components/ModalDeConfirmacao/ModalConfirmacao';

// Definição das colunas da tabela
const colunasFiis = [
  { titulo: 'Ticker', acesso: 'ticker', width: '15%', align: 'left' },
  { titulo: 'Nome do Fundo', acesso: 'nomeFundo', width: 'auto', align: 'left' },
  { titulo: 'CNPJ', acesso: 'cnpj', width: '20%', align: 'center' },
  { titulo: 'Seguimento', acesso: 'nomeSeguimento', width: '25%', align: 'left' }
];

function PaginaMeusFiis() {
  const {
    fiis,
    seguimentos, // Lista de seguimentos para popular o <select>
    onEdit,
    formData,
    showModal,
    itemSelected,
    modalAction,
    showFormModal,
    setFormData,
    setShowModal,
    dashboard,
    getFiis,
    getDashboard,
    getSeguimentos, // Função para buscar os seguimentos do select
    handleAddFii,
    handleUpdateFii,
    handleOpenCreate,
    handleEdit,
    handleOpenModal,
    executeConfirmedAction,
    closeFormModal
  } = useMeusFiis();

  // Carregar os dados na montagem do componente
  useEffect(() => {
    getFiis();
    getDashboard();
    if (getSeguimentos) getSeguimentos();
  }, [getFiis, getDashboard, getSeguimentos]);

  // Handler para o submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações
    if (!formData.ticker || !formData.nomeFundo || !formData.cnpj || !formData.idSegmento) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    // Submeter
    if (onEdit) {
      await handleUpdateFii(formData);
    } else {
      await handleAddFii(formData);
    }
  };

  const inputStyle = { padding: '0.75rem 1rem', fontSize: '1rem', width: '100%', boxSizing: 'border-box', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', color: '#334155' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', color: '#0f172a', fontFamily: 'Inter, sans-serif', padding: '2rem 1rem' }}>
      <main style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.25rem' }}>Meus FIIs</h1>
            <p style={{ color: '#475569', margin: 0 }}>Gerencie seus Fundos Imobiliários e categorias</p>
          </div>
          <button
            onClick={handleOpenCreate}
            style={{ padding: '0.65rem 1.1rem', backgroundColor: '#1d4ed8', color: '#ffffff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 10px rgba(30,64,175,0.2)' }}
          >
            + Cadastrar Novo Fundo
          </button>
        </header>

        {/* Cards de métricas */}
        <section style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ minWidth: '250px', background: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1rem', boxShadow: '0 1px 4px rgba(15,23,42,0.08)' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Total de FIIs Cadastrados</p>
            <h2 style={{ margin: '0.4rem 0', fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>{dashboard?.total || 0}</h2>
          </div>
        </section>

        {/* Tabela de FIIs */}
        <section style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(15,23,42,0.08)', padding: '1rem' }}>
          {fiis && fiis.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              Nenhum fundo encontrado.
            </div>
          ) : (
            <TableAcoes
              coluna={colunasFiis}
              data={fiis || []}
              itemsPerPage={10}
              labelpesquisa="Buscar FIIs..."
              usaEditar={true}
              acaoEditar={handleEdit}
              usaExcluir={true}
              acaoExcluir={(item) => handleOpenModal(item, 'delete')}
            />
          )}
        </section>

        {/* Modal de Formulário */}
        {showFormModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '90%', maxWidth: '500px', position: 'relative' }}>
              <button onClick={closeFormModal} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}>✖</button>

              <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1e293b', fontSize: '1.5rem', fontWeight: 700 }}>
                {onEdit ? "Editar Fundo" : "Cadastrar Fundo"}
              </h2>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input type="text" placeholder="Ticker (ex: MXRF11)" value={formData.ticker || ''} onChange={(e) => setFormData({ ...formData, ticker: e.target.value.toUpperCase() })} style={inputStyle} autoFocus />
                  <input type="text" placeholder="CNPJ" value={formData.cnpj || ''} onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })} style={inputStyle} />
                </div>

                <input type="text" placeholder="Nome do Fundo" value={formData.nomeFundo || ''} onChange={(e) => setFormData({ ...formData, nomeFundo: e.target.value })} style={inputStyle} />

                <select value={formData.idSegmento || ''} onChange={(e) => setFormData({ ...formData, idSegmento: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Selecione o Seguimento...</option>
                  {seguimentos && seguimentos.map((seg) => (
                    <option key={seg.id} value={seg.id}>{seg.nome || seg.nomeSeguimento}</option>
                  ))}
                </select>

                <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, marginTop: '0.5rem', transition: 'background-color 0.2s' }}>
                  {onEdit ? "Salvar Alterações" : "Cadastrar Fundo"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Exclusão */}
        {showModal && <ModalConfirmacao onClose={() => setShowModal(false)} onConfirm={executeConfirmedAction} action={modalAction} userName={itemSelected?.ticker} />}

      </main>
      <ToastContainer autoClose={3000} position="top-right" />
    </div>
  );
}

export default PaginaMeusFiis;
