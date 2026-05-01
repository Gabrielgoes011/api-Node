import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { TableAcoes } from '../TableAcoes';

/**
 * DataCard — container padrão de tabela da aplicação.
 *
 * Replica 100% o layout do card de tabela de operacoes.jsx:
 *  - Header com título, filtros opcionais e botão de ação
 *  - TableAcoes com busca, paginação e ações
 *  - Rodapé informativo
 *
 * Props:
 *  titulo          string              — título do card
 *  subtitulo       string?             — ex: "(42 registros)"
 *  botaoLabel      string?             — label do botão principal (omite botão se vazio)
 *  onBotaoClick    () => void?         — callback do botão principal
 *  filtros         ReactNode?          — selects/inputs extras no header (lado esquerdo)
 *  rodape          string?             — texto do rodapé (usa padrão se omitido)
 *
 *  — props repassadas ao TableAcoes —
 *  coluna          ITabela[]
 *  data            any[]
 *  itemsPerPage    number?
 *  labelpesquisa   string?
 *  usaVisualizar   bool?   acaoVisualizar  fn?
 *  usaEditar       bool?   acaoEditar      fn?
 *  usaExcluir      bool?   acaoExcluir     fn?
 *  usaResetarSenha bool?   acaoResetarSenha fn?
 *  usaInativar     bool?   acaoInativar    fn?
 *  usaReativar     bool?   acaoReativar    fn?
 */
export default function DataCard({
  // header
  titulo,
  subtitulo,
  botaoLabel,
  onBotaoClick,
  filtros,
  rodape,
  // tabela
  coluna,
  data,
  itemsPerPage,
  labelpesquisa,
  usaVisualizar,   acaoVisualizar,
  usaEditar,       acaoEditar,
  usaExcluir,      acaoExcluir,
  usaResetarSenha, acaoResetarSenha,
  usaInativar,     acaoInativar,
  usaReativar,     acaoReativar,
}) {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
    }}>
      {/* ── Header ── */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        {/* lado esquerdo: título + filtros opcionais */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
              {titulo}
            </h2>
            {subtitulo && (
              <span style={{ fontSize: '13px', color: '#64748b' }}>{subtitulo}</span>
            )}
          </div>
          {filtros}
        </div>

        {/* lado direito: botão principal */}
        {botaoLabel && onBotaoClick && (
          <button
            onClick={onBotaoClick}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontWeight: 600,
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            <AiOutlinePlus size={18} />
            {botaoLabel}
          </button>
        )}
      </div>

      {/* ── Tabela ── */}
      <TableAcoes
        coluna={coluna}
        data={data}
        itemsPerPage={itemsPerPage}
        labelpesquisa={labelpesquisa}
        usaVisualizar={usaVisualizar}     acaoVisualizar={acaoVisualizar}
        usaEditar={usaEditar}             acaoEditar={acaoEditar}
        usaExcluir={usaExcluir}           acaoExcluir={acaoExcluir}
        usaResetarSenha={usaResetarSenha} acaoResetarSenha={acaoResetarSenha}
        usaInativar={usaInativar}         acaoInativar={acaoInativar}
        usaReativar={usaReativar}         acaoReativar={acaoReativar}
        _embutido
      />

      {/* ── Rodapé ── */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        fontSize: '12px',
        color: '#64748b',
        textAlign: 'center',
      }}>
        {rodape || 'Os dados são fornecidos para fins informativos. Simulação de ambiente Web.'}
      </div>
    </div>
  );
}
