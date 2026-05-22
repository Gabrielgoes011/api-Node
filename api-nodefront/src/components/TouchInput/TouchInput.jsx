import React, { useRef, useState, useCallback } from 'react';
import { FiX } from 'react-icons/fi';

/**
 * TouchInput – Mobile-optimized input component with touch-friendly features.
 *
 * Features:
 * - Minimum 48px height (mobile best practice)
 * - 16px font size to prevent iOS auto-zoom
 * - Appropriate input types (email, tel, number, date, text, password)
 * - Auto-complete attributes for better UX
 * - Clear button (X) to quickly erase input
 * - 12px minimum spacing between elements
 * - Responsive label and error styling
 * - Keyboard-friendly with proper focus indicators
 * - Touch-optimized appearance
 *
 * @example
 * <TouchInput
 *   label="Email"
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   autoComplete="email"
 *   required
 * />
 *
 * @param {string}   label                – Label text (above input)
 * @param {string}   type                 – Input type: 'text', 'email', 'tel', 'number', 'date', 'password'
 * @param {string}   value                – Current input value
 * @param {Function} onChange             – Change handler
 * @param {string}   [autoComplete]       – HTML autocomplete attribute
 * @param {string}   [placeholder]        – Placeholder text
 * @param {boolean}  [required=false]     – Mark field as required
 * @param {boolean}  [disabled=false]     – Disabled state
 * @param {boolean}  [showClear=true]     – Show clear button when text exists
 * @param {string}   [error]              – Error message to display below input
 * @param {string}   [helperText]         – Helper text below input
 * @param {React.ReactNode} [icon]        – Optional icon to display in input
 * @param {string}   [className]          – Additional CSS classes
 * @param {object}   [style]              – Inline styles
 */
function TouchInput({
  label,
  type = 'text',
  value = '',
  onChange,
  autoComplete,
  placeholder,
  required = false,
  disabled = false,
  showClear = true,
  error,
  helperText,
  icon,
  className = '',
  style = {},
  ...props
}) {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // ─── Autocomplete mapping for common field types ────────────────────────────
  const autocompleteMap = {
    name: 'name',
    firstName: 'given-name',
    lastName: 'family-name',
    email: 'email',
    phone: 'tel',
    tel: 'tel',
    password: 'current-password',
    newPassword: 'new-password',
    address: 'street-address',
    city: 'address-level2',
    zipCode: 'postal-code',
    country: 'country-name',
  };

  // Use provided autoComplete or infer from type
  const finalAutoComplete = autoComplete || autocompleteMap[type];

  // ─── Handle clear button click ──────────────────────────────────────────────
  const handleClear = useCallback(() => {
    if (inputRef.current) {
      const event = new Event('change', { bubbles: true });
      inputRef.current.value = '';
      inputRef.current.dispatchEvent(event);
      onChange?.({ target: { value: '' } });
      inputRef.current.focus();
    }
  }, [onChange]);

  // ─── Styles ───────────────────────────────────────────────────────────────
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '12px',
    ...style,
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const requiredIndicatorStyle = {
    color: '#ef4444',
    fontSize: '16px',
  };

  const inputWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    minHeight: '48px',
    background: '#1e293b',
    border: `2px solid ${error ? '#ef4444' : isFocused ? '#10b981' : '#334155'}`,
    borderRadius: '8px',
    padding: '0 12px',
    gap: '8px',
    transition: 'border-color 150ms ease, box-shadow 150ms ease',
    boxShadow: isFocused ? '0 0 0 3px rgba(16, 185, 129, 0.1)' : 'none',
  };

  const inputStyle = {
    flex: 1,
    minHeight: '48px',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#f8fafc',
    fontSize: '16px', // Important: 16px prevents iOS auto-zoom
    fontFamily: 'inherit',
    padding: '8px 0',
    WebkitAppearance: 'none', // Remove iOS default styling
    MozAppearance: 'none',
    appearance: 'none',
    // Remove spinner from number inputs
    WebkitAutofillValue: 'transparent',
  };

  // Remove autocomplete background color (iOS/Chrome)
  const inputStyleWithAutofill = {
    ...inputStyle,
  };

  const iconStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    flexShrink: 0,
    fontSize: '18px',
  };

  const clearButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '40px',
    minHeight: '40px',
    background: 'rgba(255,255,255,0.05)',
    border: 'none',
    borderRadius: '6px',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 150ms ease',
    padding: 0,
    WebkitAppearance: 'none',
    appearance: 'none',
    flexShrink: 0,
    touchAction: 'manipulation',
  };

  const errorStyle = {
    fontSize: '13px',
    color: '#ef4444',
    marginTop: '4px',
  };

  const helperStyle = {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '4px',
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={containerStyle} className={className}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={requiredIndicatorStyle}>*</span>}
        </label>
      )}

      <div style={inputWrapperStyle}>
        {icon && <div style={iconStyle}>{icon}</div>}

        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={finalAutoComplete}
          style={inputStyleWithAutofill}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {showClear && value && (
          <button
            type="button"
            onClick={handleClear}
            style={clearButtonStyle}
            aria-label="Clear input"
            title="Clear"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = '#94a3b8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      {error && <div style={errorStyle}>{error}</div>}
      {helperText && !error && <div style={helperStyle}>{helperText}</div>}
    </div>
  );
}

export default TouchInput;
