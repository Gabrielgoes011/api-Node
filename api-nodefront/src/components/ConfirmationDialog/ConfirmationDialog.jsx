import React, { useRef, useCallback, useState, useEffect } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import BottomSheet from '../BottomSheet/BottomSheet';
import useBreakpoint from '../../hooks/useBreakpoint';
import TouchButton from '../TouchButton/TouchButton';

/**
 * ConfirmationDialog – Adaptive confirmation dialog for destructive actions.
 *
 * Automatically adapts based on device type:
 * - Mobile: BottomSheet with slide-up animation
 * - Desktop/Tablet: Centered dialog with max-width 400px
 *
 * Features:
 * - Clear warning message with record identifier
 * - Explicit user action required (no auto-dismiss)
 * - 48px minimum button height for touch targets
 * - Color-coded buttons (neutral Cancel, danger Delete)
 * - ARIA attributes for accessibility
 * - Prevents accidental deletions with clear messaging
 *
 * @example
 * <ConfirmationDialog
 *   isOpen={showConfirm}
 *   onClose={() => setShowConfirm(false)}
 *   onConfirm={handleDelete}
 *   title="Delete User"
 *   recordIdentifier="João Silva (joao@email.com)"
 *   message="This action cannot be undone. All associated data will be permanently deleted."
 * />
 *
 * @param {boolean}  isOpen              – Controls dialog visibility
 * @param {Function} onClose             – Called when user clicks Cancel or closes dialog
 * @param {Function} onConfirm           – Called when user clicks Delete (destructive action)
 * @param {string}   title               – Dialog title (usually "Delete X")
 * @param {string}   recordIdentifier    – Record identifier to display (user name, email, etc)
 * @param {string}   [message]           – Warning message explaining consequences
 * @param {string}   [confirmLabel='Excluir'] – Label for confirm button
 * @param {string}   [cancelLabel='Cancelar']   – Label for cancel button
 * @param {boolean}  [loading=false]     – Show loading state on delete button
 * @param {boolean}  [showBackdrop=true] – Show backdrop (desktop only)
 */
function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  recordIdentifier,
  message = 'Esta ação não pode ser desfeita. Todos os dados associados serão permanentemente deletados.',
  confirmLabel = 'Excluir',
  cancelLabel = 'Cancelar',
  loading = false,
  showBackdrop = true,
}) {
  const { isMobile, isDesktop, isTablet } = useBreakpoint();
  const dialogRef = useRef(null);
  const titleId = useRef(`confirmation-dialog-title-${Math.random().toString(36).slice(2)}`).current;
  const [isProcessing, setIsProcessing] = useState(false);

  // ─── Determine variant based on breakpoint ──────────────────────────────
  const useBottomSheet = isMobile;
  const useCenteredDialog = isDesktop || isTablet;

  // ─── Handle confirm with loading state ──────────────────────────────────
  const handleConfirm = useCallback(async () => {
    setIsProcessing(true);
    try {
      await onConfirm?.();
    } finally {
      setIsProcessing(false);
    }
  }, [onConfirm]);

  // ─── Keyboard handling (ESC to close) ──────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // ─── Styles ───────────────────────────────────────────────────────────
  const warningBoxStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    marginBottom: '20px',
  };

  const warningIconStyle = {
    color: '#ef4444',
    flexShrink: 0,
    marginTop: '2px',
  };

  const warningContentStyle = {
    flex: 1,
  };

  const warningTitleStyle = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#fca5a5',
    marginBottom: '4px',
  };

  const warningTextStyle = {
    fontSize: '13px',
    color: '#f87171',
    lineHeight: '1.5',
  };

  const recordStyle = {
    padding: '12px',
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '6px',
    marginBottom: '16px',
  };

  const recordLabelStyle = {
    fontSize: '12px',
    color: '#94a3b8',
    marginBottom: '4px',
  };

  const recordValueStyle = {
    fontSize: '14px',
    color: '#f1f5f9',
    fontWeight: 600,
    wordBreak: 'break-word',
  };

  const messageStyle = {
    fontSize: '14px',
    color: '#cbd5e1',
    lineHeight: '1.6',
    marginBottom: '24px',
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  };

  // ─── Render BottomSheet variant (mobile) ────────────────────────────────
  if (useBottomSheet) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        height="auto"
        closeOnBackdrop={true}
        closeOnSwipeDown={true}
      >
        <div style={{ padding: '16px' }}>
          {/* Warning box */}
          <div style={warningBoxStyle}>
            <div style={warningIconStyle}>
              <FiAlertTriangle size={20} />
            </div>
            <div style={warningContentStyle}>
              <div style={warningTitleStyle}>Ação Irreversível</div>
              <div style={warningTextStyle}>
                Esta ação não pode ser desfeita.
              </div>
            </div>
          </div>

          {/* Record identifier */}
          {recordIdentifier && (
            <div style={recordStyle}>
              <div style={recordLabelStyle}>Será deletado:</div>
              <div style={recordValueStyle}>{recordIdentifier}</div>
            </div>
          )}

          {/* Message */}
          {message && <div style={messageStyle}>{message}</div>}

          {/* Buttons */}
          <div style={buttonGroupStyle}>
            <TouchButton
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={isProcessing || loading}
              style={{ flex: 1 }}
            >
              {cancelLabel}
            </TouchButton>
            <TouchButton
              variant="danger"
              size="md"
              onClick={handleConfirm}
              loading={isProcessing || loading}
              disabled={isProcessing || loading}
              style={{ flex: 1 }}
            >
              {confirmLabel}
            </TouchButton>
          </div>
        </div>
      </BottomSheet>
    );
  }

  // ─── Render centered dialog variant (desktop/tablet) ──────────────────────
  if (useCenteredDialog) {
    return (
      <>
        {/* Backdrop */}
        {showBackdrop && isOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 1000,
              animation: 'fadeIn 200ms ease',
            }}
            onClick={onClose}
            role="presentation"
          />
        )}

        {/* Dialog */}
        <div
          ref={dialogRef}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#1e293b',
            borderRadius: '12px',
            border: '1px solid #334155',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            zIndex: 1001,
            maxWidth: '400px',
            width: '90%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
            transition: 'opacity 200ms ease',
          }}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby="confirmation-message"
        >
          {/* Header with title and warning icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '24px',
              borderBottom: '1px solid #334155',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '40px',
                minHeight: '40px',
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '8px',
                color: '#ef4444',
                flexShrink: 0,
              }}
            >
              <FiAlertTriangle size={20} />
            </div>
            <h2
              id={titleId}
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#f8fafc',
                margin: 0,
              }}
            >
              {title}
            </h2>
          </div>

          {/* Content */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Record identifier */}
            {recordIdentifier && (
              <div style={recordStyle}>
                <div style={recordLabelStyle}>Será deletado:</div>
                <div style={recordValueStyle}>{recordIdentifier}</div>
              </div>
            )}

            {/* Message */}
            {message && (
              <div id="confirmation-message" style={messageStyle}>
                {message}
              </div>
            )}
          </div>

          {/* Footer with buttons */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              padding: '20px 24px',
              borderTop: '1px solid #334155',
              flexShrink: 0,
              justifyContent: 'flex-end',
            }}
          >
            <TouchButton
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={isProcessing || loading}
            >
              {cancelLabel}
            </TouchButton>
            <TouchButton
              variant="danger"
              size="md"
              onClick={handleConfirm}
              loading={isProcessing || loading}
              disabled={isProcessing || loading}
            >
              {confirmLabel}
            </TouchButton>
          </div>
        </div>
      </>
    );
  }

  return null;
}

export default ConfirmationDialog;
