import React, { useEffect, useRef, useCallback, useState } from 'react';
import { FiX } from 'react-icons/fi';
import BottomSheet from '../BottomSheet/BottomSheet';
import useBreakpoint from '../../hooks/useBreakpoint';

/**
 * ResponsiveModal – Adaptive modal component that changes appearance based on device type.
 *
 * Desktop: Centered dialog with max-width 500px
 * Mobile (<5 fields): BottomSheet (slides up from bottom)
 * Mobile (≥5 fields): Fullscreen modal
 *
 * @example
 * <ResponsiveModal
 *   isOpen={open}
 *   onClose={() => setOpen(false)}
 *   title="Edit Record"
 *   fields={fields}
 *   onSubmit={handleSubmit}
 * >
 *   <form>
 *     {/* form content */}
 *   </form>
 * </ResponsiveModal>
 *
 * @param {boolean}  isOpen              – Controls visibility.
 * @param {Function} onClose             – Called when modal should close.
 * @param {string}   title               – Modal title.
 * @param {React.ReactNode} children     – Modal body content (usually a form).
 * @param {Array}    [fields]            – Form fields (used to decide modal type on mobile).
 * @param {React.ReactNode} [footer]    – Optional footer with action buttons.
 * @param {boolean}  [showBackdrop=true] – Show backdrop on desktop.
 */
function ResponsiveModal({
  isOpen,
  onClose,
  title,
  children,
  fields = [],
  footer,
  showBackdrop = true,
}) {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const modalRef = useRef(null);
  const titleId = useRef(`responsive-modal-title-${Math.random().toString(36).slice(2)}`).current;
  const [dragOffset, setDragOffset] = useState(0);

  // ─── Determine modal type based on device and field count ─────────────────
  // Mobile + <5 fields → BottomSheet
  // Mobile + ≥5 fields → Fullscreen modal
  // Desktop/Tablet → Centered dialog
  const useBottomSheet = isMobile && fields.length < 5;
  const useFullscreenModal = isMobile && fields.length >= 5;
  const useCenteredDialog = isDesktop || (isTablet && !useFullscreenModal);

  // ─── Focus trap for desktop modal ──────────────────────────────────────────
  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return [];
    return Array.from(
      modalRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
    );
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap for centered dialog only
      if (useCenteredDialog && e.key === 'Tab') {
        const focusable = getFocusableElements();
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [isOpen, onClose, useCenteredDialog, getFocusableElements]
  );

  // ─── Body scroll lock for desktop/fullscreen modals ────────────────────────
  useEffect(() => {
    if (isOpen && (useCenteredDialog || useFullscreenModal)) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, useCenteredDialog, useFullscreenModal]);

  // ─── Keyboard listener ─────────────────────────────────────────────────────
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ─── Render BottomSheet variant (mobile, <5 fields) ────────────────────────
  if (useBottomSheet) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        height={fields.length > 3 ? 'full' : 'half'}
      >
        <div style={{ paddingBottom: footer ? '70px' : '0' }}>
          {children}
        </div>
        {footer && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#1e293b',
            borderTop: '1px solid #334155',
            padding: '12px 16px',
            display: 'flex',
            gap: '12px',
            zIndex: 1002,
            maxHeight: '70px',
          }}>
            {footer}
          </div>
        )}
      </BottomSheet>
    );
  }

  // ─── Render fullscreen modal variant (mobile, ≥5 fields) ───────────────────
  if (useFullscreenModal) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 1000,
            }}
            onClick={onClose}
          />
        )}

        {/* Fullscreen modal */}
        <div
          ref={modalRef}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#0f172a',
            zIndex: 1001,
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            animation: isOpen ? 'fadeInUp 300ms ease' : 'fadeOutDown 300ms ease',
            '@keyframes fadeInUp': {
              from: { opacity: 0, transform: 'translateY(100%)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          {/* Fixed header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              borderBottom: '1px solid #334155',
              flexShrink: 0,
              background: '#1e293b',
            }}
          >
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
            <button
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '48px',
                minHeight: '48px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#64748b',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              aria-label="Close modal"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Scrollable content */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              WebkitOverflowScrolling: 'touch',
              paddingBottom: footer ? '80px' : '16px',
            }}
          >
            {children}
          </div>

          {/* Fixed footer */}
          {footer && (
            <div
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: '#1e293b',
                borderTop: '1px solid #334155',
                padding: '12px 16px',
                display: 'flex',
                gap: '12px',
                zIndex: 1002,
                minHeight: '70px',
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </>
    );
  }

  // ─── Render centered dialog variant (desktop/tablet) ────────────────────────
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
          />
        )}

        {/* Centered dialog */}
        <div
          ref={modalRef}
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
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
            transition: 'opacity 200ms ease',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          {/* Fixed header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid #334155',
              flexShrink: 0,
            }}
          >
            <h2
              id={titleId}
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#f8fafc',
                margin: 0,
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '48px',
                minHeight: '48px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#64748b',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              aria-label="Close modal"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Scrollable content */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              WebkitOverflowScrolling: 'touch',
              paddingBottom: footer ? '80px' : '24px',
            }}
          >
            {children}
          </div>

          {/* Fixed footer */}
          {footer && (
            <div
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: '#1e293b',
                borderTop: '1px solid #334155',
                padding: '12px 24px',
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                minHeight: '70px',
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </>
    );
  }

  // No render if conditions don't match (shouldn't happen)
  return null;
}

export default ResponsiveModal;
