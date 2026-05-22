import React, { useRef, useCallback, useState } from 'react';

/**
 * TouchButton – Mobile-optimized button component with touch feedback and accessibility.
 *
 * Features:
 * - Minimum 48px touch target (mobile best practice)
 * - Instant visual feedback (<50ms) on touch
 * - Prevents accidental double-tap zoom on iOS
 * - Optional haptic feedback on supporting devices
 * - Consistent styling with theme colors (emerald, red, slate)
 * - Focus indicators for keyboard navigation
 * - Smooth transitions and animations
 *
 * @example
 * <TouchButton
 *   onClick={() => handleSave()}
 *   variant="primary"
 *   size="lg"
 * >
 *   Save Changes
 * </TouchButton>
 *
 * @param {Function} onClick                – Click handler
 * @param {string}   [variant='primary']    – Button style: 'primary' (emerald), 'danger' (red), 'secondary' (slate)
 * @param {string}   [size='md']            – Button size: 'sm' (36px), 'md' (48px), 'lg' (56px)
 * @param {boolean}  [disabled=false]       – Disabled state
 * @param {boolean}  [haptic=true]          – Enable haptic feedback
 * @param {boolean}  [loading=false]        – Show loading state
 * @param {React.ReactNode} children        – Button content (text or icon)
 * @param {string}   [className]            – Additional CSS classes
 * @param {object}   [style]                – Inline styles
 */
function TouchButton({
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  haptic = true,
  loading = false,
  children,
  className = '',
  style = {},
  ...props
}) {
  const buttonRef = useRef(null);
  const pressTimeoutRef = useRef(null);
  const [isPressed, setIsPressed] = useState(false);

  // ─── Size mapping ──────────────────────────────────────────────────────────
  const sizeMap = {
    sm: { minWidth: '36px', minHeight: '36px', padding: '6px 12px', fontSize: '14px' },
    md: { minWidth: '48px', minHeight: '48px', padding: '8px 16px', fontSize: '15px' },
    lg: { minWidth: '56px', minHeight: '56px', padding: '12px 20px', fontSize: '16px' },
  };

  // ─── Variant mapping (colors) ──────────────────────────────────────────────
  const variantMap = {
    primary: {
      background: '#10b981',
      backgroundHover: '#059669',
      backgroundActive: '#047857',
      color: '#ffffff',
      border: 'none',
    },
    danger: {
      background: '#ef4444',
      backgroundHover: '#dc2626',
      backgroundActive: '#b91c1c',
      color: '#ffffff',
      border: 'none',
    },
    secondary: {
      background: '#64748b',
      backgroundHover: '#475569',
      backgroundActive: '#334155',
      color: '#ffffff',
      border: 'none',
    },
    outline: {
      background: 'transparent',
      backgroundHover: 'rgba(255,255,255,0.05)',
      backgroundActive: 'rgba(255,255,255,0.1)',
      color: '#64748b',
      border: '1px solid #334155',
    },
  };

  const variantStyle = variantMap[variant] || variantMap.primary;
  const sizeStyle = sizeMap[size] || sizeMap.md;

  // ─── Haptic feedback ───────────────────────────────────────────────────────
  const triggerHaptic = useCallback(() => {
    if (!haptic || typeof navigator === 'undefined') return;

    // Try standard vibration API (most Android devices, some iOS with PWA)
    if (navigator.vibrate) {
      navigator.vibrate(20); // 20ms pulse
    }
    // Fallback: Try webkit variant (older iOS devices in PWA)
    else if (navigator.webkitVibrate) {
      navigator.webkitVibrate(20);
    }
  }, [haptic]);

  // ─── Touch/Mouse event handlers ────────────────────────────────────────────
  const handleMouseDown = useCallback(
    (e) => {
      if (disabled || loading) return;

      // Set pressed state immediately for instant visual feedback (<50ms)
      setIsPressed(true);
      triggerHaptic();

      // Clear any pending timeout
      if (pressTimeoutRef.current) {
        clearTimeout(pressTimeoutRef.current);
      }

      // Apply pressed style via ref for immediate DOM update
      if (buttonRef.current) {
        buttonRef.current.style.transform = 'scale(0.95)';
      }
    },
    [disabled, loading, triggerHaptic]
  );

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);

    // Spring-back animation
    if (buttonRef.current) {
      buttonRef.current.style.transform = 'scale(1)';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPressed(false);
    if (buttonRef.current) {
      buttonRef.current.style.transform = 'scale(1)';
    }
  }, []);

  const handleClick = useCallback(
    (e) => {
      if (disabled || loading) {
        e.preventDefault();
        return;
      }

      // Prevent double-tap zoom on iOS
      if (e.detail > 1) {
        e.preventDefault();
      }

      onClick?.(e);
    },
    [onClick, disabled, loading]
  );

  // ─── Styles ───────────────────────────────────────────────────────────────
  const baseStyle = {
    ...sizeStyle,
    ...variantStyle,
    borderRadius: '8px',
    border: variantStyle.border || 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    fontWeight: 600,
    transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    userSelect: 'none',
    touchAction: 'manipulation', // Prevent double-tap zoom
    WebkitTapHighlightColor: 'transparent',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    opacity: disabled ? 0.5 : 1,
    outline: 'none',
    ...style,
  };

  // ─── Focus styles ─────────────────────────────────────────────────────────
  const focusStyle = {
    outline: '2px solid #10b981',
    outlineOffset: '2px',
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      disabled={disabled || loading}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onFocus={(e) => {
        // Show focus ring on keyboard navigation only
        if (e.nativeEvent.isTrusted) {
          Object.assign(e.currentTarget.style, focusStyle);
        }
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none';
      }}
      className={className}
      style={baseStyle}
      aria-busy={loading}
      aria-disabled={disabled}
      {...props}
    >
      {loading ? (
        <>
          <span
            style={{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: '#ffffff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
            aria-hidden="true"
          />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </>
      ) : null}
      {children}
    </button>
  );
}

export default TouchButton;
