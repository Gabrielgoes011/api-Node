import React, { useState, useMemo, memo, useEffect, useRef } from 'react';
import {
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineKey,
  AiOutlinePoweroff,
  AiOutlinePlayCircle,
  AiOutlineClose,
} from 'react-icons/ai';
import { AiOutlineSearch } from 'react-icons/ai';
import ActionMenu from '../ActionMenu/ActionMenu';

/**
 * CardView — Mobile-optimized card-based data display.
 *
 * Accepts the same props as TableAcoes for backward compatibility.
 * Renders each data record as a card with a header (primary fields),
 * a 2-column grid body (secondary fields), and an ActionMenu in the
 * top-right corner.
 *
 * @example
 * <CardView
 *   coluna={columns}
 *   data={rows}
 *   itemsPerPage={10}
 *   labelpesquisa="Buscar..."
 *   usaEditar
 *   acaoEditar={(item) => handleEdit(item)}
 *   primaryFields={['ticker', 'nome']}
 *   secondaryFields={['cnpj', 'segmento']}
 * />
 *
 * Props (same as TableAcoes for backward compatibility):
 *  coluna          Array<ColumnConfig>  — Column definitions
 *  data            Array<any>           — Data rows
 *  itemsPerPage    number?              — Rows per page (default 10)
 *  labelpesquisa   string?              — Search placeholder
 *  usaVisualizar   boolean?
 *  acaoVisualizar  (item) => void?
 *  usaEditar       boolean?
 *  acaoEditar      (item) => void?
 *  usaExcluir      boolean?
 *  acaoExcluir     (item) => void?
 *  usaResetarSenha boolean?
 *  acaoResetarSenha (item) => void?
 *  usaInativar     boolean?
 *  acaoInativar    (item) => void?
 *  usaReativar     boolean?
 *  acaoReativar    (item) => void?
 *
 * Mobile-specific:
 *  primaryFields   string[]?  — acesso keys to show in card header (bold, 16px)
 *  secondaryFields string[]?  — acesso keys to show in card body grid
 */

// ─── Date formatting helpers (mirrors TableAcoes) ────────────────────────────
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

// ─── Action color mapping (Requirements 4.12) ────────────────────────────────
const ACTION_COLORS = {
  visualizar: '#06b6d4',
  editar:     '#10b981',
  excluir:    '#ef4444',
  resetar:    '#f59e0b',
  inativar:   '#64748b',
  reativar:   '#10b981',
};

// ─── Resolve a cell value (mirrors TableAcoes logic) ─────────────────────────
function resolveCellValue(col, row) {
  const val = row[col.acesso];
  if (col.render) return col.render(val, row);
  if (val == null) return '';
  if (val && (col.acesso.toLowerCase().includes('data') || col.acesso.toLowerCase().includes('cadastro'))) {
    return col.acesso.toLowerCase().includes('hora')
      ? formatarDataComHora(val)
      : formatarDataBR(val);
  }
  return val;
}

// ─── Single card (memoised for performance – Requirement 8.5) ────────────────
const Card = memo(function Card({
  row,
  primaryCols,
  secondaryCols,
  actions,
  itemIdentifier,
  animationDelay,
}) {
  return (
    <article
      style={{
        background:   '#0f172a',
        border:       '1px solid #1e293b',
        borderRadius: '8px',
        padding:      '16px',
        boxShadow:    '0 2px 8px rgba(0,0,0,0.2)',
        position:     'relative',
        animation:    `cardFadeIn 0.25s ease both`,
        animationDelay: `${animationDelay}ms`,
      }}
    >
      {/* ── Card header: primary fields + ActionMenu ── */}
      <div
        style={{
          display:        'flex',
          alignItems:     'flex-start',
          justifyContent: 'space-between',
          gap:            '8px',
          marginBottom:   secondaryCols.length > 0 ? '12px' : 0,
        }}
      >
        {/* Primary fields */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {primaryCols.length > 0 ? (
            primaryCols.map((col, i) => {
              const value = resolveCellValue(col, row);
              return (
                <div key={i} style={{ marginBottom: i < primaryCols.length - 1 ? '4px' : 0 }}>
                  <span
                    style={{
                      fontSize:   '16px',
                      fontWeight: 700,
                      color:      '#f8fafc',
                      display:    'block',
                      overflow:   'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {value !== '' && value !== null && value !== undefined
                      ? value
                      : <span style={{ color: '#475569', fontStyle: 'italic' }}>—</span>}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color:    '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                    }}
                  >
                    {col.titulo}
                  </span>
                </div>
              );
            })
          ) : (
            // Fallback: show first column value when no primaryFields configured
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>
              {resolveCellValue(primaryCols[0] || {}, row) || '—'}
            </span>
          )}
        </div>

        {/* ActionMenu — top-right corner (Requirement 3.7) */}
        {actions.length > 0 && (
          <div style={{ flexShrink: 0, marginTop: '-4px', marginRight: '-8px' }}>
            <ActionMenu
              item={row}
              actions={actions}
              itemIdentifier={itemIdentifier}
            />
          </div>
        )}
      </div>

      {/* ── Card body: secondary fields in 2-column grid (Requirement 3.6) ── */}
      {secondaryCols.length > 0 && (
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap:                 '8px 12px',
            borderTop:           '1px solid #1e293b',
            paddingTop:          '12px',
          }}
        >
          {secondaryCols.map((col, i) => {
            const value = resolveCellValue(col, row);
            return (
              <div key={i}>
                <span
                  style={{
                    display:       'block',
                    fontSize:      '11px',
                    color:         '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                    marginBottom:  '2px',
                  }}
                >
                  {col.titulo}
                </span>
                <span
                  style={{
                    display:      'block',
                    fontSize:     '13px',
                    color:        '#cbd5e1',
                    overflow:     'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace:   col.truncate ? 'nowrap' : 'normal',
                    wordBreak:    'break-word',
                  }}
                >
                  {value !== '' && value !== null && value !== undefined
                    ? value
                    : <span style={{ color: '#475569' }}>—</span>}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
});

// ─── Main CardView component ──────────────────────────────────────────────────
const CardView = ({
  // TableAcoes-compatible props
  coluna          = [],
  data            = [],
  itemsPerPage    = 10,
  labelpesquisa   = 'Buscar...',
  usaVisualizar   = false, acaoVisualizar,
  usaEditar       = false, acaoEditar,
  usaExcluir      = false, acaoExcluir,
  usaResetarSenha = false, acaoResetarSenha,
  usaInativar     = false, acaoInativar,
  usaReativar     = false, acaoReativar,
  // Mobile-specific
  primaryFields   = [],
  secondaryFields = [],
}) => {
  const [currentPage,         setCurrentPage]         = useState(1);
  const [buscar,              setBuscar]              = useState('');
  const [debouncedBuscar,     setDebouncedBuscar]     = useState('');
  const [currentItemsPerPage, setCurrentItemsPerPage] = useState(itemsPerPage);
  const debounceTimer = useRef(null);

  // 300ms debounce for search (Requirements 8.4, 13.5)
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedBuscar(buscar);
    }, 300);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [buscar]);

  // ── Build action list for ActionMenu ──────────────────────────────────────
  const actions = useMemo(() => {
    const list = [];
    if (usaVisualizar && acaoVisualizar) {
      list.push({
        type:    'visualizar',
        handler: acaoVisualizar,
        label:   'Visualizar',
        icon:    AiOutlineEye,
        color:   ACTION_COLORS.visualizar,
      });
    }
    if (usaEditar && acaoEditar) {
      list.push({
        type:    'editar',
        handler: acaoEditar,
        label:   'Editar',
        icon:    AiOutlineEdit,
        color:   ACTION_COLORS.editar,
      });
    }
    if (usaResetarSenha && acaoResetarSenha) {
      list.push({
        type:    'resetar',
        handler: acaoResetarSenha,
        label:   'Resetar Senha',
        icon:    AiOutlineKey,
        color:   ACTION_COLORS.resetar,
      });
    }
    if (usaReativar && acaoReativar) {
      list.push({
        type:    'reativar',
        handler: acaoReativar,
        label:   'Reativar',
        icon:    AiOutlinePlayCircle,
        color:   ACTION_COLORS.reativar,
      });
    }
    if (usaInativar && acaoInativar) {
      list.push({
        type:    'inativar',
        handler: acaoInativar,
        label:   'Inativar',
        icon:    AiOutlinePoweroff,
        color:   ACTION_COLORS.inativar,
      });
    }
    if (usaExcluir && acaoExcluir) {
      list.push({
        type:                 'excluir',
        handler:              acaoExcluir,
        label:                'Excluir',
        icon:                 AiOutlineDelete,
        color:                ACTION_COLORS.excluir,
        requiresConfirmation: true,
      });
    }
    return list;
  }, [
    usaVisualizar, acaoVisualizar,
    usaEditar, acaoEditar,
    usaExcluir, acaoExcluir,
    usaResetarSenha, acaoResetarSenha,
    usaInativar, acaoInativar,
    usaReativar, acaoReativar,
  ]);

  // ── Resolve column sets ───────────────────────────────────────────────────
  const primaryCols = useMemo(() => {
    if (primaryFields.length > 0) {
      return primaryFields
        .map(key => coluna.find(c => c.acesso === key))
        .filter(Boolean);
    }
    // Fallback: first column is primary
    return coluna.slice(0, 1);
  }, [coluna, primaryFields]);

  const secondaryCols = useMemo(() => {
    if (secondaryFields.length > 0) {
      return secondaryFields
        .map(key => coluna.find(c => c.acesso === key))
        .filter(Boolean);
    }
    // Fallback: all columns except the first (primary)
    const primaryKeys = new Set(primaryCols.map(c => c.acesso));
    return coluna.filter(c => !primaryKeys.has(c.acesso));
  }, [coluna, secondaryFields, primaryCols]);

  // Identifier field for ActionMenu header (first primary field key)
  const itemIdentifier = primaryCols.length > 0 ? primaryCols[0].acesso : undefined;

  // ── Filtering (Requirement 3.9) ───────────────────────────────────────────
  const filteredData = useMemo(() => {
    if (!debouncedBuscar.trim()) return data;
    const term = debouncedBuscar.toLowerCase();
    return data.filter(item =>
      coluna.some(col => {
        const v = item[col.acesso];
        return v && v.toString().toLowerCase().includes(term);
      })
    );
  }, [data, debouncedBuscar, coluna]);

  // ── Pagination (Requirement 3.9) ──────────────────────────────────────────
  const perPage    = Number(currentItemsPerPage) || 10;
  const totalPages = Math.ceil(filteredData.length / perPage);
  const start      = (currentPage - 1) * perPage;
  const pageData   = filteredData.slice(start, start + perPage);

  const handleSearch = (e) => {
    setBuscar(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setBuscar('');
    setCurrentPage(1);
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* ── Keyframe animation (injected once) ── */}
      <style>{`
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes cardFadeIn { from { opacity: 1; } to { opacity: 1; } }
        }
      `}</style>

      {/* ── Search bar (Requirements 3.9, 13.1–13.4) ── */}
      <div
        style={{
          display:      'flex',
          gap:          '10px',
          alignItems:   'center',
          padding:      '12px 0 16px',
        }}
      >
        {/* Search icon + input wrapper */}
        <div
          style={{
            display:     'flex',
            alignItems:  'center',
            flex:        1,
            background:  '#1e293b',
            border:      '1px solid #334155',
            borderRadius: '10px',
            minHeight:   '48px',
            padding:     '0 12px',
            gap:         '8px',
            transition:  'border-color 0.2s',
          }}
          onFocusCapture={e => e.currentTarget.style.borderColor = '#10b981'}
          onBlurCapture={e => e.currentTarget.style.borderColor = '#334155'}
        >
          <AiOutlineSearch size={18} color="#64748b" aria-hidden="true" />
          <input
            type="text"
            placeholder={labelpesquisa}
            value={buscar}
            onChange={handleSearch}
            aria-label={labelpesquisa}
            style={{
              flex:       1,
              background: 'transparent',
              border:     'none',
              outline:    'none',
              color:      '#f8fafc',
              fontSize:   '16px',   // 16px prevents iOS auto-zoom (Requirement 13.2)
              minHeight:  '44px',
            }}
          />
          {buscar && (
            <button
              onClick={handleClearSearch}
              aria-label="Limpar busca"
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                minWidth:       '32px',
                minHeight:      '32px',
                background:     'transparent',
                border:         'none',
                borderRadius:   '6px',
                color:          '#64748b',
                cursor:         'pointer',
                transition:     'color 0.15s',
                padding:        0,
              }}
              onMouseOver={e => e.currentTarget.style.color = '#f8fafc'}
              onMouseOut={e => e.currentTarget.style.color = '#64748b'}
            >
              <AiOutlineClose size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ── Result count when search is active (Requirement 13.9) ── */}
      {debouncedBuscar.trim() && (
        <p
          style={{
            fontSize:     '12px',
            color:        '#64748b',
            marginBottom: '12px',
            marginTop:    '-8px',
          }}
          aria-live="polite"
        >
          {filteredData.length === 0
            ? 'Nenhum resultado encontrado'
            : `${filteredData.length} resultado${filteredData.length !== 1 ? 's' : ''} encontrado${filteredData.length !== 1 ? 's' : ''}`}
        </p>
      )}

      {/* ── Cards list ── */}
      {pageData.length === 0 ? (
        /* Empty state (Requirement 3.10) */
        <div
          style={{
            padding:    '48px 24px',
            textAlign:  'center',
            color:      '#475569',
            fontSize:   '14px',
            background: '#0f172a',
            border:     '1px solid #1e293b',
            borderRadius: '8px',
          }}
          role="status"
          aria-live="polite"
        >
          Nenhum registro encontrado
        </div>
      ) : (
        <div
          style={{
            display:       'flex',
            flexDirection: 'column',
            gap:           '12px',   // Requirement 3.8
          }}
          role="list"
          aria-label="Lista de registros"
        >
          {pageData.map((row, index) => (
            <div key={index} role="listitem">
              <Card
                row={row}
                primaryCols={primaryCols}
                secondaryCols={secondaryCols}
                actions={actions}
                itemIdentifier={itemIdentifier}
                animationDelay={index * 50}  // 50ms stagger (Requirement 21.4)
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination (Requirement 3.9) ── */}
      <div
        style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          flexWrap:       'wrap',
          gap:            '12px',
          marginTop:      '16px',
          fontSize:       '13px',
          color:          '#64748b',
        }}
      >
        {/* Items per page */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Mostrar</span>
          <input
            type="number"
            min="1"
            value={currentItemsPerPage}
            onChange={e => {
              setCurrentItemsPerPage(e.target.value === '' ? '' : Number(e.target.value));
              setCurrentPage(1);
            }}
            onBlur={e => {
              if (!e.target.value || Number(e.target.value) < 1) setCurrentItemsPerPage(10);
            }}
            aria-label="Itens por página"
            style={{
              width:        '64px',
              padding:      '6px 8px',
              background:   '#1e293b',
              border:       '1px solid #334155',
              borderRadius: '6px',
              outline:      'none',
              color:        '#f8fafc',
              fontSize:     '13px',
              textAlign:    'center',
              minHeight:    '36px',
            }}
          />
          <span>itens</span>
        </div>

        {/* Page navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Página anterior"
            style={{
              minWidth:     '80px',
              minHeight:    '40px',
              padding:      '0 12px',
              background:   '#1e293b',
              border:       '1px solid #334155',
              borderRadius: '8px',
              color:        '#94a3b8',
              cursor:       currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize:     '13px',
              fontWeight:   500,
              opacity:      currentPage === 1 ? 0.4 : 1,
              transition:   'all 0.15s',
            }}
            onMouseOver={e => { if (currentPage !== 1) { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.color = '#10b981'; } }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            Anterior
          </button>

          <span
            style={{ fontWeight: 500, color: '#94a3b8', minWidth: '100px', textAlign: 'center' }}
            aria-live="polite"
            aria-atomic="true"
          >
            Página {currentPage} de {Math.max(1, totalPages)}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages || totalPages === 0}
            aria-label="Próxima página"
            style={{
              minWidth:     '80px',
              minHeight:    '40px',
              padding:      '0 12px',
              background:   '#1e293b',
              border:       '1px solid #334155',
              borderRadius: '8px',
              color:        '#94a3b8',
              cursor:       (currentPage >= totalPages || totalPages === 0) ? 'not-allowed' : 'pointer',
              fontSize:     '13px',
              fontWeight:   500,
              opacity:      (currentPage >= totalPages || totalPages === 0) ? 0.4 : 1,
              transition:   'all 0.15s',
            }}
            onMouseOver={e => { if (currentPage < totalPages) { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.color = '#10b981'; } }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardView;
