import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete, AiOutlineKey, AiOutlinePoweroff, AiOutlinePlayCircle, AiOutlineClose } from 'react-icons/ai';

// Formatação de datas com fallback
let formatarDataBR;
let formatarDataComHora;
try {
  const dateUtils = require('../../utils/dateUtils');
  formatarDataBR      = dateUtils.formatarDataBR      || ((d) => d ? new Date(d).toLocaleDateString('pt-BR')  : '');
  formatarDataComHora = dateUtils.formatarDataComHora || ((d) => d ? new Date(d).toLocaleString('pt-BR')      : '');
} catch {
  formatarDataBR      = (d) => d ? new Date(d).toLocaleDateString('pt-BR')  : '';
  formatarDataComHora = (d) => d ? new Date(d).toLocaleString('pt-BR')      : '';
}

/**
 * TableAcoes — tabela universal da aplicação.
 *
 * Quando _embutido=true (usado dentro do DataCard) não renderiza o wrapper
 * externo com borda/sombra — o DataCard já provê o container.
 */
const TableAcoes = ({
  coluna,
  data,
  itemsPerPage    = 10,
  labelpesquisa   = 'Buscar...',
  usaVisualizar   = false, acaoVisualizar,
  usaEditar       = false, acaoEditar,
  usaExcluir      = false, acaoExcluir,
  usaResetarSenha = false, acaoResetarSenha,
  usaInativar     = false, acaoInativar,
  usaReativar     = false, acaoReativar,
  // props legadas (mantidas para não quebrar uso existente)
  paddingHead     = '4px 8px',
  paddingBody     = '4px 8px',
  tamanhoIcones   = 'fs-5',
  tamanhoFontBody = '13px',
  tamanhoFontHead = '13px',
  // quando true, omite wrapper externo (DataCard já provê o container)
  _embutido       = false,
}) => {
  const [currentPage,        setCurrentPage]        = useState(1);
  const [buscar,             setBuscar]             = useState('');
  const [currentItemsPerPage, setCurrentItemsPerPage] = useState(itemsPerPage);

  const temAcoes = usaVisualizar || usaEditar || usaExcluir || usaResetarSenha || usaInativar || usaReativar;

  // ── filtragem ──
  const filteredData = data.filter(item => {
    if (!buscar.trim()) return true;
    const term = buscar.toLowerCase();
    return coluna.some(col => {
      const v = item[col.acesso];
      return v && v.toString().toLowerCase().includes(term);
    });
  });

  // ── paginação ──
  const perPage    = Number(currentItemsPerPage) || 10;
  const totalPages = Math.ceil(filteredData.length / perPage);
  const start      = (currentPage - 1) * perPage;
  const pageData   = filteredData.slice(start, start + perPage);

  // ── estilos de botão de ação ──
  const btnBase = {
    color: '#cbd5e1', cursor: 'pointer', padding: '0.375rem',
    borderRadius: '0.375rem', backgroundColor: 'transparent',
    border: 'none', display: 'inline-flex', alignItems: 'center',
    justifyContent: 'center', transition: 'all 0.2s',
  };

  // ── conteúdo interno ──
  const inner = (
    <>
      {/* Busca */}
      <div style={{
        display: 'flex', gap: '10px', alignItems: 'center',
        padding: '1rem',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
      }}>
        <input
          type="text"
          placeholder={labelpesquisa}
          value={buscar}
          onChange={e => { setBuscar(e.target.value); setCurrentPage(1); }}
          style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', flex: 1, outline: 'none', color: '#334155', fontSize: '14px' }}
        />
        {buscar && (
          <button
            onClick={() => setBuscar('')}
            style={{ padding: '0.5rem', background: '#f1f5f9', border: 'none', borderRadius: '0.375rem', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Limpar busca"
          >
            <AiOutlineClose size={18} />
          </button>
        )}
      </div>

      {/* Tabela */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#dbeafe', color: '#334155', fontSize: '14px', borderBottom: '2px solid #93c5fd' }}>
              {coluna.map((col, i) => (
                <th key={i} style={{ padding: '1rem', fontWeight: 600, width: col.width || 'auto', textAlign: col.align || 'left', whiteSpace: 'nowrap' }}>
                  {col.titulo}
                </th>
              ))}
              {temAcoes && (
                <th style={{ padding: '1rem 2rem 1rem 1rem', fontWeight: 600, textAlign: 'center', width: '160px', whiteSpace: 'nowrap' }}>
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody style={{ fontSize: '14px' }}>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={coluna.length + (temAcoes ? 1 : 0)} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : pageData.map((row, ri) => (
              <tr
                key={ri}
                style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: ri % 2 === 0 ? '#ffffff' : '#fafbfc', transition: 'background-color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = ri % 2 === 0 ? '#ffffff' : '#fafbfc'}
              >
                {coluna.map((col, ci) => {
                  const val = row[col.acesso];
                  let display = val ?? '';
                  if (val && (col.acesso.toLowerCase().includes('data') || col.acesso.toLowerCase().includes('cadastro'))) {
                    display = col.acesso.toLowerCase().includes('hora') ? formatarDataComHora(val) : formatarDataBR(val);
                  }
                  return (
                    <td key={ci} style={{ padding: '1rem', fontWeight: 500, color: '#334155', width: col.width || 'auto', textAlign: col.align || 'left', overflow: col.truncate ? 'hidden' : 'visible', textOverflow: col.truncate ? 'ellipsis' : 'clip', whiteSpace: col.truncate ? 'nowrap' : 'normal', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                      {display}
                    </td>
                  );
                })}
                {temAcoes && (
                  <td style={{ padding: '1rem 2rem 1rem 1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      {usaVisualizar && acaoVisualizar && (
                        <button onClick={() => acaoVisualizar(row)} style={btnBase} title="Visualizar"
                          onMouseOver={e => { e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.backgroundColor = '#dbeafe'; }}
                          onMouseOut={e => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                          <AiOutlineEye size={18} />
                        </button>
                      )}
                      {usaEditar && acaoEditar && (
                        <button onClick={() => acaoEditar(row)} style={btnBase} title="Editar"
                          onMouseOver={e => { e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.backgroundColor = '#dbeafe'; }}
                          onMouseOut={e => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                          <AiOutlineEdit size={18} />
                        </button>
                      )}
                      {usaResetarSenha && acaoResetarSenha && (
                        <button onClick={() => acaoResetarSenha(row)} style={btnBase} title="Resetar Senha"
                          onMouseOver={e => { e.currentTarget.style.color = '#f59e0b'; e.currentTarget.style.backgroundColor = '#fef3c7'; }}
                          onMouseOut={e => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                          <AiOutlineKey size={18} />
                        </button>
                      )}
                      {usaReativar && acaoReativar && (
                        <button onClick={() => acaoReativar(row)} style={btnBase} title="Reativar"
                          onMouseOver={e => { e.currentTarget.style.color = '#10b981'; e.currentTarget.style.backgroundColor = '#d1fae5'; }}
                          onMouseOut={e => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                          <AiOutlinePlayCircle size={18} />
                        </button>
                      )}
                      {usaInativar && acaoInativar && (
                        <button onClick={() => acaoInativar(row)} style={btnBase} title="Inativar"
                          onMouseOver={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                          onMouseOut={e => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                          <AiOutlinePoweroff size={18} />
                        </button>
                      )}
                      {usaExcluir && acaoExcluir && (
                        <button onClick={() => acaoExcluir(row)} style={btnBase} title="Excluir"
                          onMouseOver={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = '#fee2e2'; }}
                          onMouseOut={e => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                          <AiOutlineDelete size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '14px', color: '#475569' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Mostrar</span>
          <input
            type="number" min="1" value={currentItemsPerPage}
            onChange={e => { setCurrentItemsPerPage(e.target.value === '' ? '' : Number(e.target.value)); setCurrentPage(1); }}
            onBlur={e => { if (!e.target.value || Number(e.target.value) < 1) setCurrentItemsPerPage(10); }}
            style={{ width: '70px', padding: '0.375rem 0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', outline: 'none', color: '#334155', fontSize: '14px', textAlign: 'center' }}
          />
          <span>linhas</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            style={{ padding: '0.375rem 0.75rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.375rem', color: '#334155', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 500, opacity: currentPage === 1 ? 0.5 : 1 }}
            onMouseOver={e => { if (currentPage !== 1) e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
            onMouseOut={e => { if (currentPage !== 1) e.currentTarget.style.backgroundColor = '#ffffff'; }}>
            Anterior
          </button>
          <span style={{ fontWeight: 500 }}>Página {currentPage} de {Math.max(1, totalPages)}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages || totalPages === 0}
            style={{ padding: '0.375rem 0.75rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.375rem', color: '#334155', cursor: (currentPage >= totalPages || totalPages === 0) ? 'not-allowed' : 'pointer', fontWeight: 500, opacity: (currentPage >= totalPages || totalPages === 0) ? 0.5 : 1 }}
            onMouseOver={e => { if (currentPage < totalPages) e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
            onMouseOut={e => { if (currentPage < totalPages) e.currentTarget.style.backgroundColor = '#ffffff'; }}>
            Próxima
          </button>
        </div>
      </div>
    </>
  );

  // quando embutido no DataCard, não precisa de wrapper próprio
  if (_embutido) return inner;

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {inner}
      </div>
    </div>
  );
};

export default TableAcoes;
