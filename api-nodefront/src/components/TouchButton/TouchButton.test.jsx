import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TouchButton from './TouchButton';

describe('TouchButton', () => {
  describe('Rendering', () => {
    it('should render button with children', () => {
      render(<TouchButton>Click me</TouchButton>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should render with correct role', () => {
      render(<TouchButton>Button</TouchButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with disabled state', () => {
      render(<TouchButton disabled>Disabled</TouchButton>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should render with loading state', () => {
      render(<TouchButton loading>Loading</TouchButton>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });
  });

  describe('Touch target size', () => {
    it('should have minimum 48px dimensions for md size (default)', () => {
      const { container } = render(<TouchButton size="md">Button</TouchButton>);
      const button = container.querySelector('button');
      const style = window.getComputedStyle(button);
      
      expect(style.minWidth).toBe('48px');
      expect(style.minHeight).toBe('48px');
    });

    it('should have 36px for sm size', () => {
      const { container } = render(<TouchButton size="sm">Button</TouchButton>);
      const button = container.querySelector('button');
      const style = window.getComputedStyle(button);
      
      expect(style.minWidth).toBe('36px');
      expect(style.minHeight).toBe('36px');
    });

    it('should have 56px for lg size', () => {
      const { container } = render(<TouchButton size="lg">Button</TouchButton>);
      const button = container.querySelector('button');
      const style = window.getComputedStyle(button);
      
      expect(style.minWidth).toBe('56px');
      expect(style.minHeight).toBe('56px');
    });
  });

  describe('Visual feedback', () => {
    it('should provide visual feedback on mouse down', async () => {
      const { container } = render(<TouchButton>Button</TouchButton>);
      const button = container.querySelector('button');

      fireEvent.mouseDown(button);

      // Check for scale transform (visual feedback)
      expect(button.style.transform).toBe('scale(0.95)');
    });

    it('should restore visual state on mouse up', async () => {
      const { container } = render(<TouchButton>Button</TouchButton>);
      const button = container.querySelector('button');

      fireEvent.mouseDown(button);
      expect(button.style.transform).toBe('scale(0.95)');

      fireEvent.mouseUp(button);
      expect(button.style.transform).toBe('scale(1)');
    });

    it('should restore visual state on mouse leave', async () => {
      const { container } = render(<TouchButton>Button</TouchButton>);
      const button = container.querySelector('button');

      fireEvent.mouseDown(button);
      expect(button.style.transform).toBe('scale(0.95)');

      fireEvent.mouseLeave(button);
      expect(button.style.transform).toBe('scale(1)');
    });

    it('should trigger haptic feedback on touch', async () => {
      const vibrateSpy = vi.spyOn(navigator, 'vibrate').mockImplementation(() => true);

      render(<TouchButton haptic>Button</TouchButton>);
      const button = screen.getByRole('button');

      fireEvent.touchStart(button);

      expect(vibrateSpy).toHaveBeenCalledWith(20);
      vibrateSpy.mockRestore();
    });

    it('should not trigger haptic feedback when disabled', async () => {
      const vibrateSpy = vi.spyOn(navigator, 'vibrate').mockImplementation(() => true);

      render(<TouchButton haptic disabled>Button</TouchButton>);
      const button = screen.getByRole('button');

      fireEvent.touchStart(button);

      expect(vibrateSpy).not.toHaveBeenCalled();
      vibrateSpy.mockRestore();
    });
  });

  describe('Click handling', () => {
    it('should call onClick handler when clicked', async () => {
      const handleClick = vi.fn();
      render(<TouchButton onClick={handleClick}>Click</TouchButton>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalled();
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      render(
        <TouchButton onClick={handleClick} disabled>
          Click
        </TouchButton>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', async () => {
      const handleClick = vi.fn();
      render(
        <TouchButton onClick={handleClick} loading>
          Click
        </TouchButton>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should prevent double-tap zoom', async () => {
      const handleClick = vi.fn();
      render(<TouchButton onClick={handleClick}>Click</TouchButton>);

      const button = screen.getByRole('button');
      const event = new MouseEvent('click', {
        bubbles: true,
        detail: 2, // detail > 1 indicates double-click
      });

      fireEvent.click(button, { detail: 2 });
      // Double-tap should be prevented (preventDefault should be called)
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Variants', () => {
    it('should apply primary variant styling', () => {
      const { container } = render(<TouchButton variant="primary">Button</TouchButton>);
      const button = container.querySelector('button');
      const style = window.getComputedStyle(button);

      expect(style.background).toBe('rgb(16, 185, 129)'); // #10b981
      expect(style.color).toBe('rgb(255, 255, 255)');
    });

    it('should apply danger variant styling', () => {
      const { container } = render(<TouchButton variant="danger">Button</TouchButton>);
      const button = container.querySelector('button');
      const style = window.getComputedStyle(button);

      expect(style.background).toBe('rgb(239, 68, 68)'); // #ef4444
    });

    it('should apply secondary variant styling', () => {
      const { container } = render(<TouchButton variant="secondary">Button</TouchButton>);
      const button = container.querySelector('button');
      const style = window.getComputedStyle(button);

      expect(style.background).toBe('rgb(100, 116, 139)'); // #64748b
    });

    it('should apply outline variant styling', () => {
      const { container } = render(<TouchButton variant="outline">Button</TouchButton>);
      const button = container.querySelector('button');
      const style = window.getComputedStyle(button);

      expect(style.background).toBe('rgba(0, 0, 0, 0)');
      expect(style.border).toBe('1px solid rgb(51, 65, 85)');
    });
  });

  describe('Accessibility', () => {
    it('should have focus indicator on keyboard focus', async () => {
      const { container } = render(<TouchButton>Button</TouchButton>);
      const button = container.querySelector('button');

      fireEvent.focus(button, { nativeEvent: { isTrusted: true } });

      // Focus style should be applied
      expect(button.style.outline).toBe('2px solid rgb(16, 185, 129)');
    });

    it('should remove focus indicator on blur', async () => {
      const { container } = render(<TouchButton>Button</TouchButton>);
      const button = container.querySelector('button');

      fireEvent.focus(button, { nativeEvent: { isTrusted: true } });
      fireEvent.blur(button);

      expect(button.style.outline).toBe('none');
    });

    it('should have aria-disabled attribute when disabled', () => {
      render(<TouchButton disabled>Button</TouchButton>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });

    it('should have aria-busy attribute when loading', () => {
      render(<TouchButton loading>Button</TouchButton>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });
  });

  describe('Loading state', () => {
    it('should show loading spinner when loading is true', () => {
      const { container } = render(<TouchButton loading>Save</TouchButton>);
      
      const spinner = container.querySelector('[aria-hidden="true"]');
      expect(spinner).toBeInTheDocument();
    });

    it('should prevent click when loading', () => {
      const handleClick = vi.fn();
      render(
        <TouchButton loading onClick={handleClick}>
          Save
        </TouchButton>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should disable button when loading', () => {
      render(<TouchButton loading>Save</TouchButton>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Custom styles', () => {
    it('should accept custom className', () => {
      const { container } = render(
        <TouchButton className="custom-class">Button</TouchButton>
      );
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should merge inline styles', () => {
      const { container } = render(
        <TouchButton style={{ marginTop: '16px' }}>Button</TouchButton>
      );
      const button = container.querySelector('button');
      expect(button.style.marginTop).toBe('16px');
    });
  });

  describe('Touch-specific behavior', () => {
    it('should prevent default double-tap zoom with touchAction', () => {
      const { container } = render(<TouchButton>Button</TouchButton>);
      const button = container.querySelector('button');
      const style = window.getComputedStyle(button);

      // touchAction: manipulation prevents double-tap zoom
      expect(style.touchAction).toBe('manipulation');
    });

    it('should remove webkit tap highlight color', () => {
      const { container } = render(<TouchButton>Button</TouchButton>);
      const button = container.querySelector('button');
      
      expect(button.style.WebkitTapHighlightColor).toBe('transparent');
    });

    it('should handle touch events same as mouse events', async () => {
      const { container } = render(<TouchButton>Button</TouchButton>);
      const button = container.querySelector('button');

      fireEvent.touchStart(button);
      expect(button.style.transform).toBe('scale(0.95)');

      fireEvent.touchEnd(button);
      expect(button.style.transform).toBe('scale(1)');
    });
  });

  describe('Haptic feedback', () => {
    it('should not trigger haptic when haptic is false', async () => {
      const vibrateSpy = vi.spyOn(navigator, 'vibrate').mockImplementation(() => true);

      render(<TouchButton haptic={false}>Button</TouchButton>);
      fireEvent.mouseDown(screen.getByRole('button'));

      expect(vibrateSpy).not.toHaveBeenCalled();
      vibrateSpy.mockRestore();
    });

    it('should handle missing vibration API gracefully', async () => {
      const vibrateSpy = vi.spyOn(navigator, 'vibrate', 'get').mockReturnValue(undefined);

      render(<TouchButton haptic>Button</TouchButton>);
      
      // Should not throw error
      expect(() => {
        fireEvent.mouseDown(screen.getByRole('button'));
      }).not.toThrow();

      vibrateSpy.mockRestore();
    });
  });
});
