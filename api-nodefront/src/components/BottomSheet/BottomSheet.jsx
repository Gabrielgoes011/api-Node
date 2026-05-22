import React, { useEffect, useRef, useCallback, useState } from 'react';
import { FiX } from 'react-icons/fi';

/**
 * BottomSheet – Mobile-native modal that slides up from the bottom of the screen.
 *
 * @example
 * <BottomSheet
 *   isOpen={open}
 *   onClose={() => setOpen(false)}
 *   title="Ações"
 *   height="half"
 * >
 *   <p>Content goes here</p>
 * </BottomSheet>
 *
 * @param {boolean}  isOpen            – Controls visibility.
 * @param {Function} onClose           – Called when the sheet should close.
 * @param {string}   [title]           – Optional header title.
 * @param {React.ReactNode} children   – Sheet body content.
 * @param {'auto'|'half'|'full'} [height='auto'] – Sheet height: auto, 40% (half) or 90% (full) of viewport.
 * @param {boolean}  [showHandle=true]         – Show drag handle at top.
 * @param {boolean}  [closeOnBackdrop=true]    – Close when backdrop is clicked.
 * @param {boolean}  [closeOnSwipeDown=true]   – Close on downward swipe gesture.
 */
function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  height = 'auto',
  showHandle = true,
  closeOnBackdrop = true,
  closeOnSwipeDown = true,
}) {
  // ─── Refs ────────────────────────────────────────────────────────────────
  const sheetRef = useRef(null);
  const backdropRef = useRef(null);
  const titleId = useRef(`bottom-sheet-title-${Math.random().toString(36).slice(2)}`).current;

  // ─── Swipe state ─────────────────────────────────────────────────────────
  const dragStartY = useRef(null);
  const currentTranslate = useRef(0);
  const isDragging = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);

  // ─── Height mapping ───────────────────────────────────────────────────────
  const heightMap = {
    auto: 'auto',
    half: '60vh',
    full: '90vh',
  };
  const sheetHeight = heightMap[height] ?? 'auto';

  // ─── Focus trap ───────────────────────────────────────────────────────────
  const getFocusableElements = useCallback(() => {
    if (!sheetRef.current) return [];
    return Array.from(
      sheetRef.current.querySelectorAll(
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

      if (e.key === 'Tab') {
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
    [isOpen, onClose, getFocusableElements]
  );

  // ─── Body scroll lock ─────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Move focus into the sheet
      requestAnimationFrame(() => {
        const focusable = getFocusableElements();
        if (focusable.length > 0) focusable[0].focus();
      });
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, getFocusableElements]);

  // ─── Keyboard listener ────────────────────────────────────────────────────
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ─── Swipe-to-close gesture ───────────────────────────────────────────────
  const handleTouchStart = useCallback(
    (e) => {
      if (!closeOnSwipeDown) return;
      dragStartY.current = e.touches[0].clientY;
      currentTranslate.current = 0;
      isDragging.current = true;
    },
    [closeOnSwipeDown]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging.current || dragStartY.current === null) return;
      const delta = e.touches[0].clientY - dragStartY.current;
      if (delta < 0) return; // only allow downward drag
      currentTranslate.current = delta;
      setDragOffset(delta);
    },
    []
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const threshold = 80; // px – spring physics: close if dragged past threshold
    if (currentTranslate.current > threshold) {
      setDragOffset(0);
      onClose();
    } else {
      // Spring back
      setDragOffset(0);
    }
    dragStartY.current = null;
    currentTranslate.current = 0;
  }, [onClose]);

  // ─── Styles ───────────────────────────────────────────────────────────────
  const backdropStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    zIndex: 1000,
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
    transition: 'opacity 200ms ease',
  };

  const sheetStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#1e293b',
    borderTop: '1px solid #334155',
    borderRadius: '16px 16px 0 0',
    zIndex: 1001,
    height: sheetHeight,
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
    transform: isOpen
      ? `translateY(${dragOffset}px)`
      : 'translateY(100%)',
    transition: isDragging.current
      ? 'none'
      : 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform',
    touchAction: 'none',
  };

  const handleStyle = {
    width: '40px',
    height: '4px',
    background: '#475569',
    borderRadius: '2px',
    margin: '10px auto 6px',
    flexShrink: 0,
    cursor: 'grab',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: title ? 'space-between' : 'flex-end',
    padding: '8px 16px 12px',
    borderBottom: title ? '1px solid #334155' : 'none',
    flexShrink: 0,
  };

  const titleStyle = {
    fontSize: '16px',
    fontWeight: 700,
    color: '#f8fafc',
    margin: 0,
  };

  const closeButtonStyle = {
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
    flexShrink: 0,
  };

  const contentStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    WebkitOverflowScrolling: 'touch',
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  // Keep the DOM node mounted so the close animation plays; hide via transform
  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        style={backdropStyle}
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        style={sheetStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        {showHandle && (
          <div style={handleStyle} aria-hidden="true" />
        )}

        {/* Header */}
        {(title || true) && (
          <div style={headerStyle}>
            {title && (
              <h2 id={titleId} style={titleStyle}>
                {title}
              </h2>
            )}
            <button
              onClick={onClose}
              style={closeButtonStyle}
              aria-label="Fechar"
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#f8fafc';
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#64748b';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
            >
              <FiX size={18} />
            </button>
          </div>
        )}

        {/* Scrollable content */}
        <div style={contentStyle}>
          {children}
        </div>
      </div>
    </>
  );
}

export default BottomSheet;
