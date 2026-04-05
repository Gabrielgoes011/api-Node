import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete, AiOutlineKey, AiOutlinePoweroff, AiOutlinePlayCircle, AiOutlineClose } from 'react-icons/ai';

// Interface ITabela (documentação):
// titulo: string - título da coluna
// acesso: string - nome da propriedade no objeto de dados
// width?: string - largura da coluna (ex: "100px", "20%", "auto")
// align?: 'left' | 'center' | 'right' - alinhamento do conteúdo
// truncate?: boolean - se deve truncar texto longo
// sticky?: 'left' | 'right' - coluna fixa na lateral

// Funções de formatação de data - fallback se não estiverem disponíveis
let formatarDataBR;
let formatarDataComHora;

try {
  const dateUtils = require('../../utils/dateUtils');
  formatarDataBR = dateUtils.formatarDataBR || ((data) => data ? new Date(data).toLocaleDateString('pt-BR') : '');
  formatarDataComHora = dateUtils.formatarDataComHora || ((data) => data ? new Date(data).toLocaleString('pt-BR') : '');
} catch {
  // Fallback se o módulo não existir
  formatarDataBR = (data) => data ? new Date(data).toLocaleDateString('pt-BR') : '';
  formatarDataComHora = (data) => data ? new Date(data).toLocaleString('pt-BR') : '';
}

//Propriedades para TableAcoes - Versão Universal Simplificada
// coluna: array de objetos ITabela
// data: array de objetos com os dados
// itemsPerPage: número de itens por página (padrão: 10)
// labelpesquisa: texto do placeholder da busca (padrão: "Buscar...")
// usaVisualizar, usaEditar, usaExcluir: boolean para mostrar botões de ação
// acaoVisualizar, acaoEditar, acaoExcluir: funções callback para ações
// paddingHead, paddingBody: estilos de padding
// tamanhoIcones, tamanhoFontBody, tamanhoFontHead: estilos de fonte

const TableAcoes = ({
  coluna,
  data,
  itemsPerPage = 10,
  labelpesquisa = "Buscar...",
  usaVisualizar = false,
  acaoVisualizar,
  usaEditar = false,
  acaoEditar,
  usaExcluir = false,
  acaoExcluir,
  usaResetarSenha = false,
  acaoResetarSenha,
  usaInativar = false,
  acaoInativar,
  usaReativar = false,
  acaoReativar,
  paddingHead = '4px 8px',
  paddingBody = '4px 8px',
  tamanhoIcones = 'fs-5',
  tamanhoFontBody = '13px',
  tamanhoFontHead = '13px'
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [buscar, setBuscar] = useState('');
  const [currentItemsPerPage, setCurrentItemsPerPage] = useState(itemsPerPage);

  // Filtragem simples
  const filteredData = data.filter((item) => {
    if (!buscar.trim()) return true;
    const searchTerm = buscar.toLowerCase();
    return coluna.some(col => {
      const value = item[col.acesso];
      return value && value.toString().toLowerCase().includes(searchTerm);
    });
  });

  // Paginação simples
  const activeItemsPerPage = Number(currentItemsPerPage) || 10;
  const totalPages = Math.ceil(filteredData.length / activeItemsPerPage);
  const startIndex = (currentPage - 1) * activeItemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + activeItemsPerPage);

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
        {/* Campo de busca */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#ffffff', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <input
            type="text"
            placeholder={labelpesquisa}
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', flex: 1, outline: 'none', color: '#334155', fontSize: '14px' }}
          />
          {buscar && (
            <button
              onClick={() => setBuscar('')}
              style={{ padding: '0.5rem', background: '#f1f5f9', border: 'none', borderRadius: '0.375rem', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Limpar busca"
            >
              <AiOutlineClose size={18} />
            </button>
          )}
        </div>

      {/* Tabela */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
              <tr style={{ backgroundColor: '#dbeafe', color: '#334155', fontSize: '14px', borderBottom: '2px solid #93c5fd' }}>
              {coluna.map((col, index) => (
                <th key={index} style={{ 
                    padding: '1rem',
                    fontWeight: 600,
                    width: col.width || 'auto',
                    textAlign: col.align || 'left',
                    whiteSpace: 'nowrap'
                  }}>
                  {col.titulo}
                </th>
              ))}
              {(usaVisualizar || usaEditar || usaExcluir || usaResetarSenha || usaInativar || usaReativar) && (
                <th style={{ 
                    padding: '1rem 2rem 1rem 1rem',
                    fontWeight: 600,
                    textAlign: 'center',
                    width: '200px',
                    whiteSpace: 'nowrap'
                  }}>
                  Ações
                </th>
              )}
            </tr>
          </thead>
            <tbody style={{ fontSize: '14px' }}>
            {paginatedData.map((row, rowIndex) => (
                <tr 
                  key={rowIndex}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#fafbfc',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = rowIndex % 2 === 0 ? '#ffffff' : '#fafbfc'}
                >
                {coluna.map((col, colIndex) => (
                  <td key={colIndex} style={{ 
                      padding: '1rem',
                      fontWeight: 500,
                      color: '#334155',
                      width: col.width || 'auto',
                      textAlign: col.align || 'left',
                      overflow: col.truncate ? 'hidden' : 'visible',
                      textOverflow: col.truncate ? 'ellipsis' : 'clip'
                    }}>
                    {row[col.acesso] ? (
                      col.acesso.toLowerCase().includes('data') || col.acesso.toLowerCase().includes('cadastro') ?
                        (col.acesso.toLowerCase().includes('hora') ? formatarDataComHora(row[col.acesso]) : formatarDataBR(row[col.acesso]))
                        : row[col.acesso]
                    ) : ''}
                  </td>
                ))}
              {(usaVisualizar || usaEditar || usaExcluir || usaResetarSenha || usaInativar || usaReativar) && (
                <td style={{ 
                      padding: '1rem 2rem 1rem 1rem',
                      textAlign: 'center'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  {usaVisualizar && acaoVisualizar && (
                    <button
                      onClick={() => acaoVisualizar(row)}
                            style={{ color: '#cbd5e1', cursor: 'pointer', padding: '0.375rem', borderRadius: '0.375rem', backgroundColor: 'transparent', border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                            onMouseOver={(e) => { e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.backgroundColor = '#dbeafe'; }}
                            onMouseOut={(e) => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                            title="Visualizar"
                          >
                            <AiOutlineEye size={18} />
                    </button>
                  )}
                  {usaEditar && acaoEditar && (
                    <button
                      onClick={() => acaoEditar(row)}
                            style={{ color: '#cbd5e1', cursor: 'pointer', padding: '0.375rem', borderRadius: '0.375rem', backgroundColor: 'transparent', border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                            onMouseOver={(e) => { e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.backgroundColor = '#dbeafe'; }}
                            onMouseOut={(e) => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                            title="Editar"
                          >
                            <AiOutlineEdit size={18} />
                    </button>
                  )}
                  {usaResetarSenha && acaoResetarSenha && (
                    <button
                      onClick={() => acaoResetarSenha(row)}
                            style={{ color: '#cbd5e1', cursor: 'pointer', padding: '0.375rem', borderRadius: '0.375rem', backgroundColor: 'transparent', border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                            onMouseOver={(e) => { e.currentTarget.style.color = '#f59e0b'; e.currentTarget.style.backgroundColor = '#fef3c7'; }}
                            onMouseOut={(e) => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                            title="Resetar Senha"
                          >
                            <AiOutlineKey size={18} />
                    </button>
                  )}
                  {usaReativar && acaoReativar && (
                    <button
                      onClick={() => acaoReativar(row)}
                            style={{ color: '#cbd5e1', cursor: 'pointer', padding: '0.375rem', borderRadius: '0.375rem', backgroundColor: 'transparent', border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                            onMouseOver={(e) => { e.currentTarget.style.color = '#10b981'; e.currentTarget.style.backgroundColor = '#d1fae5'; }}
                            onMouseOut={(e) => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                            title="Reativar Usuário"
                          >
                            <AiOutlinePlayCircle size={18} />
                    </button>
                  )}
                  {usaInativar && acaoInativar && (
                    <button
                      onClick={() => acaoInativar(row)}
                            style={{ color: '#cbd5e1', cursor: 'pointer', padding: '0.375rem', borderRadius: '0.375rem', backgroundColor: 'transparent', border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                            onMouseOver={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                            onMouseOut={(e) => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                            title="Inativar Usuário"
                          >
                            <AiOutlinePoweroff size={18} />
                    </button>
                  )}
                  {usaExcluir && acaoExcluir && (
                    <button
                      onClick={() => acaoExcluir(row)}
                            style={{ color: '#cbd5e1', cursor: 'pointer', padding: '0.375rem', borderRadius: '0.375rem', backgroundColor: 'transparent', border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                            onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = '#fee2e2'; }}
                            onMouseOut={(e) => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                            title="Excluir"
                          >
                            <AiOutlineDelete size={18} />
                    </button>
                  )}
                      </div>
                </td>
              )}
            </tr>
          ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={coluna.length + 1} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
        </tbody>
          </table>
        </div>

        {/* Paginação e Filtro de Linhas */}
        <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '14px', color: '#475569' }}>
          
          {/* Seletor de itens por página */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Mostrar</span>
            <input
              type="number"
              min="1"
              value={currentItemsPerPage}
              onChange={(e) => {
                const val = e.target.value;
                setCurrentItemsPerPage(val === '' ? '' : Number(val));
                setCurrentPage(1);
              }}
              onBlur={(e) => {
                if (e.target.value === '' || Number(e.target.value) < 1) {
                  setCurrentItemsPerPage(10);
                }
              }}
              style={{ width: '70px', padding: '0.375rem 0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', outline: 'none', color: '#334155', fontSize: '14px', textAlign: 'center' }}
            />
            <span>linhas</span>
          </div>

          {/* Controles de navegação */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
              style={{ 
                padding: '0.375rem 0.75rem', 
                backgroundColor: '#ffffff', 
                border: '1px solid #cbd5e1', 
                borderRadius: '0.375rem', 
                color: '#334155', 
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontWeight: 500,
                opacity: currentPage === 1 ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { if(currentPage !== 1) e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
              onMouseOut={(e) => { if(currentPage !== 1) e.currentTarget.style.backgroundColor = '#ffffff'; }}
          >
            Anterior
          </button>
            <span style={{ fontWeight: 500 }}>
              Página {currentPage} de {Math.max(1, totalPages)}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages || totalPages === 0}
              style={{ 
                padding: '0.375rem 0.75rem', 
                backgroundColor: '#ffffff', 
                border: '1px solid #cbd5e1', 
                borderRadius: '0.375rem', 
                color: '#334155', 
                cursor: (currentPage >= totalPages || totalPages === 0) ? 'not-allowed' : 'pointer',
                fontWeight: 500,
                opacity: (currentPage >= totalPages || totalPages === 0) ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { if(currentPage !== totalPages && totalPages > 0) e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
              onMouseOut={(e) => { if(currentPage !== totalPages && totalPages > 0) e.currentTarget.style.backgroundColor = '#ffffff'; }}
          >
            Próxima
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableAcoes;