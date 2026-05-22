import React, { useState } from 'react';
import BottomSheet from '../BottomSheet/BottomSheet';

/**
 * ActionMenu — compact action menu for mobile card views.
 *
 * Renders a vertical ellipsis icon (⋮) with a 48px touch target.
 * On tap, opens a BottomSheet listing all available actions.
 *
 * Props:
 *  item             any                  — The data item the actions apply to
 *  actions          Array<ActionConfig>  — List of available actions
 *  itemIdentifier   string?              — Field name to display in BottomSheet header (e.g. "ticker")
 *
 * ActionConfig:
 *  type                'visualizar' | 'editar' | 'excluir' | 'resetar' | 'inativar' | 'reativar'
 *  handler             (item: any) => void
 *  label               string
 *  icon                React.ComponentType
 *  color               string
 *  requiresConfirmation boolean?
 */

/** Default color mapping per action type (Requirements 4.12) */
const ACTION_COLORS = {
  visualizar: '#06b6d4',  // cyan
  editar:     '#10b981',  // emerald
  excluir:    '#ef4444',  // red
  resetar:    '#f59e0b',  // amber
  inativar:   '#64748b',  // slate
  reativar:   '#10b981',  // emerald
};

function ActionMenu({ item, actions = [], itemIdentifier }) {
  const [isOpen, setIsOpen]           = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Resolve the identifier value to show in the BottomSheet header
  const identifierValue = itemIdentifier && item
    ? (item[itemIdentifier] ?? '')
    : '';

  const handleOpen = (e) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleActionClick = (action) => {
    if (action.requiresConfirmation) {
      // Close the main sheet and open confirmation sheet
      setIsOpen(false);
      setPendingAction(action);
      setConfirmOpen(true);
    } else {
      setIsOpen(false);
      action.handler(item);
    }
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    if (pendingAction) {
      pendingAction.handler(item);
      setPendingAction(null);
    }
  };

  const handleCancelConfirm = () => {
    setConfirmOpen(false);
    setPendingAction(null);
  };

  return (
    <>
      {/* Trigger button — 48px touch target (Requirements 4.1, 4.2, 5.1) */}
      <button
        onClick={handleOpen}
        aria-label="Abrir menu de ações"
        style={{
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          minWidth:        '48px',
          minHeight:       '48px',
          width:           '48px',
          height:          '48px',
          background:      'transparent',
          border:          'none',
          borderRadius:    '8px',
          color:           '#94a3b8',
          cursor:          'pointer',
          fontSize:        '20px',
          lineHeight:      1,
          transition:      'background 0.15s, color 0.15s',
          flexShrink:      0,
        }}
        onTouchStart={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.color      = '#f8fafc';
        }}
        onTouchEnd={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color      = '#94a3b8';
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
          e.currentTarget.style.color      = '#f8fafc';
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color      = '#94a3b8';
        }}
      >
        ⋮
      </button>

      {/* Main actions BottomSheet (Requirements 4.3, 4.7, 4.8, 4.10, 4.11) */}
      <BottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title={identifierValue ? `Ações — ${identifierValue}` : 'Ações'}
      >
        <div
          style={{
            display:       'flex',
            flexDirection: 'column',
            gap:           '8px',
            padding:       '8px 0 4px',
          }}
        >
          {actions.map((action, index) => {
            const color = action.color || ACTION_COLORS[action.type] || '#94a3b8';
            const IconComponent = action.icon;

            return (
              <button
                key={`${action.type}-${index}`}
                onClick={() => handleActionClick(action)}
                aria-label={action.label}
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  gap:            '14px',
                  width:          '100%',
                  minHeight:      '48px',
                  padding:        '0 16px',
                  background:     'transparent',
                  border:         '1px solid rgba(255,255,255,0.06)',
                  borderRadius:   '10px',
                  color:          color,
                  cursor:         'pointer',
                  fontSize:       '15px',
                  fontWeight:     500,
                  textAlign:      'left',
                  transition:     'background 0.15s, transform 0.1s',
                }}
                onTouchStart={e => {
                  e.currentTarget.style.background  = `${color}18`;
                  e.currentTarget.style.transform   = 'scale(0.98)';
                }}
                onTouchEnd={e => {
                  e.currentTarget.style.background  = 'transparent';
                  e.currentTarget.style.transform   = 'scale(1)';
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = `${color}14`;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {/* Icon (Requirements 4.7) */}
                {IconComponent && (
                  <span
                    style={{
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      width:          '32px',
                      height:         '32px',
                      borderRadius:   '8px',
                      background:     `${color}18`,
                      flexShrink:     0,
                    }}
                  >
                    <IconComponent size={18} color={color} />
                  </span>
                )}

                {/* Label */}
                <span style={{ flex: 1 }}>{action.label}</span>
              </button>
            );
          })}
        </div>
      </BottomSheet>

      {/* Confirmation BottomSheet for destructive actions (Requirements 4.8, 5.2, 5.3) */}
      {pendingAction && (
        <BottomSheet
          isOpen={confirmOpen}
          onClose={handleCancelConfirm}
          title="Confirmar ação"
        >
          <div style={{ padding: '8px 0 4px' }}>
            {/* Warning message */}
            <p style={{
              fontSize:     '14px',
              color:        '#94a3b8',
              lineHeight:   1.6,
              marginBottom: '20px',
            }}>
              {identifierValue
                ? `Deseja realmente executar "${pendingAction.label}" em ${identifierValue}?`
                : `Deseja realmente executar "${pendingAction.label}"?`}
            </p>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Cancel */}
              <button
                onClick={handleCancelConfirm}
                style={{
                  flex:         1,
                  minHeight:    '48px',
                  background:   'transparent',
                  border:       '1px solid #334155',
                  borderRadius: '10px',
                  color:        '#64748b',
                  cursor:       'pointer',
                  fontSize:     '15px',
                  fontWeight:   600,
                  transition:   'all 0.15s',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = '#475569';
                  e.currentTarget.style.color       = '#f8fafc';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = '#334155';
                  e.currentTarget.style.color       = '#64748b';
                }}
              >
                Cancelar
              </button>

              {/* Confirm */}
              <button
                onClick={handleConfirm}
                style={{
                  flex:         1,
                  minHeight:    '48px',
                  background:   pendingAction.color || ACTION_COLORS[pendingAction.type] || '#10b981',
                  border:       'none',
                  borderRadius: '10px',
                  color:        '#fff',
                  cursor:       'pointer',
                  fontSize:     '15px',
                  fontWeight:   600,
                  transition:   'filter 0.15s, transform 0.1s',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.filter    = 'brightness(1.1)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.filter    = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </BottomSheet>
      )}
    </>
  );
}

export default ActionMenu;
