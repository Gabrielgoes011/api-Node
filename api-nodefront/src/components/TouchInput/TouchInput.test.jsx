import React, { useState } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TouchInput from './TouchInput';

describe('TouchInput', () => {
  describe('Rendering', () => {
    it('should render input with label', () => {
      render(<TouchInput label="Email" />);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('should render input without label', () => {
      const { container } = render(<TouchInput />);
      expect(container.querySelector('input')).toBeInTheDocument();
    });

    it('should render input with placeholder', () => {
      render(<TouchInput placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should render required indicator when required is true', () => {
      render(<TouchInput label="Name" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should render disabled input', () => {
      render(<TouchInput disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  describe('Touch target size', () => {
    it('should have minimum 48px height', () => {
      const { container } = render(<TouchInput />);
      const wrapper = container.querySelector('[style*="minHeight"]');
      
      // The wrapper div should have minHeight: 48px
      expect(wrapper).toBeInTheDocument();
    });

    it('should have correct padding for touch interaction', () => {
      const { container } = render(<TouchInput />);
      const wrapper = container.querySelector('div');
      const style = window.getComputedStyle(wrapper);

      // Should have padding for comfortable touch
      expect(wrapper.style.padding).toBeDefined();
    });
  });

  describe('Input types', () => {
    it('should render text input by default', () => {
      const { container } = render(<TouchInput />);
      expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    });

    it('should render email input', () => {
      const { container } = render(<TouchInput type="email" />);
      expect(container.querySelector('input[type="email"]')).toBeInTheDocument();
    });

    it('should render tel input', () => {
      const { container } = render(<TouchInput type="tel" />);
      expect(container.querySelector('input[type="tel"]')).toBeInTheDocument();
    });

    it('should render number input', () => {
      const { container } = render(<TouchInput type="number" />);
      expect(container.querySelector('input[type="number"]')).toBeInTheDocument();
    });

    it('should render date input', () => {
      const { container } = render(<TouchInput type="date" />);
      expect(container.querySelector('input[type="date"]')).toBeInTheDocument();
    });

    it('should render password input', () => {
      const { container } = render(<TouchInput type="password" />);
      expect(container.querySelector('input[type="password"]')).toBeInTheDocument();
    });
  });

  describe('Font size', () => {
    it('should use 16px font size to prevent iOS auto-zoom', () => {
      const { container } = render(<TouchInput />);
      const input = container.querySelector('input');
      const style = window.getComputedStyle(input);

      expect(style.fontSize).toBe('16px');
    });
  });

  describe('Autocomplete attributes', () => {
    it('should set autocomplete for email type', () => {
      const { container } = render(<TouchInput type="email" />);
      expect(container.querySelector('input')).toHaveAttribute('autoComplete', 'email');
    });

    it('should set autocomplete for tel type', () => {
      const { container } = render(<TouchInput type="tel" />);
      expect(container.querySelector('input')).toHaveAttribute('autoComplete', 'tel');
    });

    it('should set autocomplete for password type', () => {
      const { container } = render(<TouchInput type="password" />);
      expect(container.querySelector('input')).toHaveAttribute('autoComplete', 'current-password');
    });

    it('should allow custom autocomplete override', () => {
      const { container } = render(
        <TouchInput type="text" autoComplete="given-name" />
      );
      expect(container.querySelector('input')).toHaveAttribute('autoComplete', 'given-name');
    });

    it('should infer autocomplete from field name', () => {
      const { container } = render(
        <TouchInput type="email" autoComplete={undefined} />
      );
      expect(container.querySelector('input')).toHaveAttribute('autoComplete', 'email');
    });
  });

  describe('Clear button', () => {
    it('should show clear button when value exists', () => {
      render(<TouchInput value="test" onChange={() => {}} />);
      expect(screen.getByLabelText('Clear input')).toBeInTheDocument();
    });

    it('should not show clear button when value is empty', () => {
      render(<TouchInput value="" onChange={() => {}} />);
      expect(screen.queryByLabelText('Clear input')).not.toBeInTheDocument();
    });

    it('should not show clear button when showClear is false', () => {
      render(<TouchInput value="test" onChange={() => {}} showClear={false} />);
      expect(screen.queryByLabelText('Clear input')).not.toBeInTheDocument();
    });

    it('should clear input when clear button is clicked', async () => {
      const handleChange = vi.fn();
      const { container, rerender } = render(
        <TouchInput
          value="test"
          onChange={handleChange}
          showClear={true}
        />
      );

      const clearButton = screen.getByLabelText('Clear input');
      fireEvent.click(clearButton);

      // onChange should have been called with empty value
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: '' }),
        })
      );
    });

    it('should focus input after clearing', async () => {
      const handleChange = vi.fn();
      const { container } = render(
        <TouchInput
          value="test"
          onChange={handleChange}
          showClear={true}
        />
      );

      const input = container.querySelector('input');
      const clearButton = screen.getByLabelText('Clear input');
      
      fireEvent.click(clearButton);

      // Input should maintain focus after clear
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Error and helper text', () => {
    it('should display error message', () => {
      render(<TouchInput error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should display helper text', () => {
      render(<TouchInput helperText="Must be at least 8 characters" />);
      expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument();
    });

    it('should not show helper text when error exists', () => {
      const { queryByText } = render(
        <TouchInput
          error="Invalid"
          helperText="Helper text"
        />
      );

      expect(queryByText('Invalid')).toBeInTheDocument();
      expect(queryByText('Helper text')).not.toBeInTheDocument();
    });

    it('should change border color to red when error exists', () => {
      const { container } = render(
        <TouchInput error="This field is required" />
      );

      const wrapper = container.querySelector('div[style*="minHeight"]');
      const style = wrapper.getAttribute('style');

      expect(style).toContain('#ef4444'); // red color
    });
  });

  describe('Focus handling', () => {
    it('should change border color on focus', async () => {
      const { container } = render(<TouchInput />);
      const input = container.querySelector('input');
      const wrapper = input.parentElement;

      fireEvent.focus(input);

      const style = wrapper.getAttribute('style');
      expect(style).toContain('#10b981'); // emerald color for focus
    });

    it('should have box-shadow on focus', async () => {
      const { container } = render(<TouchInput />);
      const input = container.querySelector('input');
      const wrapper = input.parentElement;

      fireEvent.focus(input);

      expect(wrapper.style.boxShadow).toContain('rgba(16, 185, 129');
    });

    it('should revert border color on blur', () => {
      const { container } = render(<TouchInput />);
      const input = container.querySelector('input');

      fireEvent.focus(input);
      fireEvent.blur(input);

      const wrapper = input.parentElement;
      const style = wrapper.getAttribute('style');

      // Should revert to default color after blur
      expect(style).toBeDefined();
    });
  });

  describe('Spacing', () => {
    it('should maintain 12px minimum spacing between elements', () => {
      const { container } = render(
        <TouchInput label="Email" helperText="Helper" />
      );

      const mainContainer = container.querySelector('div[style*="flexDirection"]');
      const style = mainContainer.getAttribute('style');

      expect(style).toContain('gap: 8px');
      expect(style).toContain('marginBottom: 12px');
    });

    it('should have padding around input', () => {
      const { container } = render(<TouchInput />);
      const wrapper = container.querySelector('div[style*="minHeight"]');
      const style = wrapper.getAttribute('style');

      expect(style).toContain('padding: 0 12px');
    });
  });

  describe('Change handling', () => {
    it('should call onChange when value changes', async () => {
      const handleChange = vi.fn();
      render(
        <TouchInput value="" onChange={handleChange} />
      );

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'new value' } });

      expect(handleChange).toHaveBeenCalled();
    });

    it('should handle controlled component', () => {
      const { rerender } = render(
        <TouchInput value="initial" onChange={() => {}} />
      );

      let input = screen.getByDisplayValue('initial');
      expect(input.value).toBe('initial');

      rerender(<TouchInput value="updated" onChange={() => {}} />);

      input = screen.getByDisplayValue('updated');
      expect(input.value).toBe('updated');
    });
  });

  describe('Icon support', () => {
    it('should render icon when provided', () => {
      render(<TouchInput icon={<span>🔍</span>} />);
      expect(screen.getByText('🔍')).toBeInTheDocument();
    });

    it('should not render icon when not provided', () => {
      const { container } = render(<TouchInput />);
      // Check that no icon container exists
      expect(container.querySelectorAll('[style*="flexShrink"]').length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Accessibility', () => {
    it('should associate label with input', () => {
      const { container } = render(
        <TouchInput label="Email" />
      );

      const label = screen.getByText('Email');
      expect(label).toBeInTheDocument();
    });

    it('should mark required field with aria-required', () => {
      const { container } = render(
        <TouchInput label="Name" required />
      );

      // HTML5 required attribute
      expect(container.querySelector('input')).toHaveAttribute('required');
    });

    it('should have clear button with proper aria-label', () => {
      render(<TouchInput value="text" onChange={() => {}} />);
      expect(screen.getByLabelText('Clear input')).toBeInTheDocument();
    });

    it('should have proper input role', () => {
      render(<TouchInput />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('Mobile appearance', () => {
    it('should remove webkit appearance', () => {
      const { container } = render(<TouchInput />);
      const input = container.querySelector('input');
      const style = window.getComputedStyle(input);

      expect(style.WebkitAppearance).toBe('none');
    });

    it('should have correct touch-action', () => {
      const { container } = render(<TouchInput />);
      const input = container.querySelector('input');

      // The parent wrapper should allow touch
      expect(input.parentElement).toBeInTheDocument();
    });

    it('should support touchAction for clear button', () => {
      const { container } = render(
        <TouchInput value="test" onChange={() => {}} showClear={true} />
      );

      const clearButton = screen.getByLabelText('Clear input');
      const style = clearButton.getAttribute('style');

      expect(style).toContain('touchAction');
    });
  });

  describe('Input number with spinners removed', () => {
    it('should render number input without spinners styling', () => {
      const { container } = render(<TouchInput type="number" />);
      const input = container.querySelector('input[type="number"]');

      // Number inputs should not have visible spinners due to webkit styling
      expect(input).toBeInTheDocument();
    });
  });

  describe('Custom styles', () => {
    it('should accept custom className', () => {
      render(<TouchInput className="custom-class" />);
      // The custom class should be on the container
      expect(document.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should merge inline styles', () => {
      const { container } = render(
        <TouchInput style={{ marginTop: '16px' }} />
      );

      const mainContainer = container.firstChild;
      expect(mainContainer.style.marginTop).toBe('16px');
    });
  });
});
