import React from 'react';
import useBreakpoint from '../../hooks/useBreakpoint';
import { TableAcoes } from '../TableAcoes';
import CardView from '../CardView/CardView';

/**
 * ResponsiveTable — Wrapper that renders the appropriate data-display
 * component based on the current viewport breakpoint.
 *
 * - Desktop / Tablet  → TableAcoes  (full table with inline action buttons)
 * - Mobile            → CardView    (card-based layout with ActionMenu)
 *
 * The component is a drop-in replacement for TableAcoes: every prop that
 * TableAcoes accepts is forwarded unchanged, so existing pages require no
 * modifications beyond swapping the component name.
 *
 * Two extra props allow callers to configure the CardView layout:
 *   cardPrimaryFields   — acesso keys rendered in the card header (bold, 16px)
 *   cardSecondaryFields — acesso keys rendered in the card body grid
 *
 * If those props are omitted, CardView falls back to its own defaults
 * (first column as primary, remaining columns as secondary).
 *
 * @example
 * <ResponsiveTable
 *   coluna={columns}
 *   data={rows}
 *   itemsPerPage={10}
 *   labelpesquisa="Buscar fundo..."
 *   usaEditar
 *   acaoEditar={handleEdit}
 *   usaExcluir
 *   acaoExcluir={handleDelete}
 *   cardPrimaryFields={['ticker', 'nome']}
 *   cardSecondaryFields={['cnpj', 'segmento']}
 * />
 *
 * Props (all optional unless noted):
 *  coluna              Array<ColumnConfig>  — Column definitions (required)
 *  data                Array<any>           — Data rows (required)
 *  itemsPerPage        number?              — Rows / cards per page (default 10)
 *  labelpesquisa       string?              — Search placeholder
 *
 *  usaVisualizar       boolean?
 *  acaoVisualizar      (item) => void?
 *  usaEditar           boolean?
 *  acaoEditar          (item) => void?
 *  usaExcluir          boolean?
 *  acaoExcluir         (item) => void?
 *  usaResetarSenha     boolean?
 *  acaoResetarSenha    (item) => void?
 *  usaInativar         boolean?
 *  acaoInativar        (item) => void?
 *  usaReativar         boolean?
 *  acaoReativar        (item) => void?
 *
 *  // TableAcoes legacy props (forwarded as-is, ignored by CardView)
 *  paddingHead         string?
 *  paddingBody         string?
 *  tamanhoIcones       string?
 *  tamanhoFontBody     string?
 *  tamanhoFontHead     string?
 *  _embutido           boolean?
 *
 *  // Mobile-specific (forwarded to CardView only)
 *  cardPrimaryFields   string[]?
 *  cardSecondaryFields string[]?
 *
 * Requirements: 3.1, 3.2, 3.3, 17.1, 17.2, 19.1, 19.2
 */
const ResponsiveTable = ({
  // ── Core data props ──────────────────────────────────────────────────────
  coluna           = [],
  data             = [],
  itemsPerPage     = 10,
  labelpesquisa    = 'Buscar...',

  // ── Action flags & handlers ───────────────────────────────────────────────
  usaVisualizar    = false, acaoVisualizar,
  usaEditar        = false, acaoEditar,
  usaExcluir       = false, acaoExcluir,
  usaResetarSenha  = false, acaoResetarSenha,
  usaInativar      = false, acaoInativar,
  usaReativar      = false, acaoReativar,

  // ── TableAcoes legacy / styling props (forwarded to TableAcoes only) ─────
  paddingHead      = '4px 8px',
  paddingBody      = '4px 8px',
  tamanhoIcones    = 'fs-5',
  tamanhoFontBody  = '13px',
  tamanhoFontHead  = '13px',
  _embutido        = false,

  // ── Mobile-specific props (forwarded to CardView only) ───────────────────
  cardPrimaryFields   = [],
  cardSecondaryFields = [],
}) => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  // ── Shared props passed to both components ────────────────────────────────
  const sharedProps = {
    coluna,
    data,
    itemsPerPage,
    labelpesquisa,
    usaVisualizar,    acaoVisualizar,
    usaEditar,        acaoEditar,
    usaExcluir,       acaoExcluir,
    usaResetarSenha,  acaoResetarSenha,
    usaInativar,      acaoInativar,
    usaReativar,      acaoReativar,
  };

  // ── Desktop / Tablet → TableAcoes (Requirements 3.2, 17.1) ───────────────
  if (isDesktop || isTablet) {
    return (
      <TableAcoes
        {...sharedProps}
        paddingHead={paddingHead}
        paddingBody={paddingBody}
        tamanhoIcones={tamanhoIcones}
        tamanhoFontBody={tamanhoFontBody}
        tamanhoFontHead={tamanhoFontHead}
        _embutido={_embutido}
      />
    );
  }

  // ── Mobile → CardView (Requirements 3.1, 3.3, 17.2) ─────────────────────
  if (isMobile) {
    return (
      <CardView
        {...sharedProps}
        primaryFields={cardPrimaryFields}
        secondaryFields={cardSecondaryFields}
      />
    );
  }

  // ── Fallback: default to TableAcoes (e.g. SSR / matchMedia unavailable) ──
  return (
    <TableAcoes
      {...sharedProps}
      paddingHead={paddingHead}
      paddingBody={paddingBody}
      tamanhoIcones={tamanhoIcones}
      tamanhoFontBody={tamanhoFontBody}
      tamanhoFontHead={tamanhoFontHead}
      _embutido={_embutido}
    />
  );
};

export default ResponsiveTable;
