import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrashAlt, FaKey, FaPowerOff, FaPlay, FaTimes } from 'react-icons/fa';

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
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      {/* Campo de busca */}
      <div style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder={labelpesquisa}
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flex: 1 }}
        />
        {buscar && (
          <button
            onClick={() => setBuscar('')}
            style={{ padding: '8px', background: '#f8f9fa', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Tabela */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <Table striped bordered hover style={{ width: '100%', tableLayout: 'fixed', marginBottom: 0, borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {coluna.map((col, index) => (
                <th key={index} style={{ 
                  padding: paddingHead, 
                  fontSize: tamanhoFontHead,
                  width: col.width || 'auto',
                  textAlign: col.align || 'left',
                  whiteSpace: 'nowrap',
                  borderRight: index < coluna.length - 1 ? '1px solid #dee2e6' : 'none',
                  backgroundColor: '#f8f9fa'
                }}>
                  {col.titulo}
                </th>
              ))}
              {(usaVisualizar || usaEditar || usaExcluir || usaResetarSenha || usaInativar || usaReativar) && (
                <th style={{ 
                  padding: paddingHead, 
                  fontSize: tamanhoFontHead, 
                  textAlign: 'center', 
                  width: '200px',
                  backgroundColor: '#f8f9fa',
                  borderLeft: '1px solid #dee2e6'
                }}>
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {coluna.map((col, colIndex) => (
                  <td key={colIndex} style={{ 
                    padding: paddingBody, 
                    fontSize: tamanhoFontBody,
                    width: col.width || 'auto',
                    textAlign: col.align || 'left',
                    overflow: col.truncate ? 'hidden' : 'visible',
                    textOverflow: col.truncate ? 'ellipsis' : 'clip',
                    borderRight: colIndex < coluna.length - 1 ? '1px solid #dee2e6' : 'none'
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
                  textAlign: 'center', 
                  padding: paddingBody,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  flexWrap: 'nowrap',
                  whiteSpace: 'nowrap',
                  minWidth: '200px',
                  minHeight: '50px',
                  borderLeft: '1px solid #dee2e6'
                }}>
                  {usaVisualizar && acaoVisualizar && (
                    <button
                      onClick={() => acaoVisualizar(row)}
                      style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: '2px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
                      title="Visualizar"
                    >
                      <FaEye />
                    </button>
                  )}
                  {usaEditar && acaoEditar && (
                    <button
                      onClick={() => acaoEditar(row)}
                      style={{ background: 'none', border: 'none', color: '#ffc107', cursor: 'pointer', padding: '2px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                  )}
                  {usaResetarSenha && acaoResetarSenha && (
                    <button
                      onClick={() => acaoResetarSenha(row)}
                      style={{ background: 'none', border: 'none', color: '#ffc107', cursor: 'pointer', padding: '2px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
                      title="Resetar Senha"
                    >
                      <FaKey />
                    </button>
                  )}
                  {usaReativar && acaoReativar && (
                    <button
                      onClick={() => acaoReativar(row)}
                      style={{ background: 'none', border: 'none', color: '#28a745', cursor: 'pointer', padding: '2px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
                      title="Reativar Usuário"
                    >
                      <FaPlay />
                    </button>
                  )}
                  {usaInativar && acaoInativar && (
                    <button
                      onClick={() => acaoInativar(row)}
                      style={{ background: 'none', border: 'none', color: '#6c757d', cursor: 'pointer', padding: '2px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
                      title="Inativar Usuário"
                    >
                      <FaPowerOff />
                    </button>
                  )}
                  {usaExcluir && acaoExcluir && (
                    <button
                      onClick={() => acaoExcluir(row)}
                      style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', padding: '2px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
                      title="Excluir"
                    >
                      <FaTrashAlt />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
        </Table>
      </div>

      {/* Paginação simples */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{ margin: '0 5px', padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            Anterior
          </button>
          <span style={{ margin: '0 10px', alignSelf: 'center' }}>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{ margin: '0 5px', padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default TableAcoes;