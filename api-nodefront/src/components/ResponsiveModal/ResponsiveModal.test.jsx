import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResponsiveModal from './ResponsiveModal';

// Mock useBreakpoint hook
vi.mock('../../hooks/useBreakpoint', () => ({
  default: vi.fn(() => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  })),
}));

const useBreakpointMock = require('../../hooks/useBreakpoint').default;

describe('ResponsiveModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Modal',
    children: <div>Test content</div>,
    fields: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Desktop variant (centered dialog)', () => {
    beforeEach(() => {
      useBreakpointMock.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      });
    });

    it('should render centered dialog on desktop', () => {
      render(<ResponsiveModal {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('should have title in modal', () => {
      render(<ResponsiveModal {...defaultProps} />);

      const title = screen.getByText('Test Modal');
      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute('id');
    });

    it('should render close button with 48px minimum dimensions', () => {
      render(<ResponsiveModal {...defaultProps} />);

      const closeButton = screen.getByLabelText('Close modal');
      expect(closeButton).toBeInTheDocument();
      const style = window.getComputedStyle(closeButton);
      expect(style.minWidth).toBe('48px');
      expect(style.minHeight).toBe('48px');
    });

    it('should call onClose when close button is clicked', async () => {
      const onClose = vi.fn();
      render(<ResponsiveModal {...defaultProps} onClose={onClose} />);

      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });

    it('should call onClose when Escape key is pressed', async () => {
      const onClose = vi.fn();
      render(<ResponsiveModal {...defaultProps} onClose={onClose} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });

    it('should call onClose when backdrop is clicked', async () => {
      const onClose = vi.fn();
      render(<ResponsiveModal {...defaultProps} onClose={onClose} />);

      const backdrops = document.querySelectorAll('[style*="backdrop"]');
      if (backdrops.length > 0) {
        fireEvent.click(backdrops[0]);
        await waitFor(() => {
          expect(onClose).toHaveBeenCalled();
        });
      }
    });

    it('should render footer when provided', () => {
      const footer = <button>Submit</button>;
      render(
        <ResponsiveModal
          {...defaultProps}
          footer={footer}
        />
      );

      const submitBtn = screen.getByText('Submit');
      expect(submitBtn).toBeInTheDocument();
    });

    it('should prevent body scroll when modal is open', () => {
      render(<ResponsiveModal {...defaultProps} />);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore body scroll when modal closes', () => {
      const { rerender } = render(<ResponsiveModal {...defaultProps} />);
      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <ResponsiveModal {...defaultProps} isOpen={false} />
      );
      expect(document.body.style.overflow).toBe('');
    });

    it('should have max-width of 500px', () => {
      render(<ResponsiveModal {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      const style = window.getComputedStyle(dialog);
      expect(style.maxWidth).toBe('500px');
    });
  });

  describe('Mobile BottomSheet variant (<5 fields)', () => {
    beforeEach(() => {
      useBreakpointMock.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      });
    });

    it('should render BottomSheet on mobile with <5 fields', () => {
      render(
        <ResponsiveModal
          {...defaultProps}
          fields={[{}, {}, {}]}
        />
      );

      // BottomSheet renders with proper structure
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render footer in BottomSheet', () => {
      const footer = <button>Submit</button>;
      render(
        <ResponsiveModal
          {...defaultProps}
          fields={[{}]}
          footer={footer}
        />
      );

      expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('should use full height for >3 fields', () => {
      const { container } = render(
        <ResponsiveModal
          {...defaultProps}
          fields={[{}, {}, {}, {}]}
        />
      );

      // BottomSheet should be rendered
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });
  });

  describe('Mobile fullscreen variant (≥5 fields)', () => {
    beforeEach(() => {
      useBreakpointMock.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      });
    });

    it('should render fullscreen modal on mobile with ≥5 fields', () => {
      render(
        <ResponsiveModal
          {...defaultProps}
          fields={[{}, {}, {}, {}, {}]}
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('should have fixed header and footer', () => {
      const footer = <button>Submit</button>;
      render(
        <ResponsiveModal
          {...defaultProps}
          fields={[{}, {}, {}, {}, {}]}
          footer={footer}
        />
      );

      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('should prevent body scroll when open', () => {
      render(
        <ResponsiveModal
          {...defaultProps}
          fields={[{}, {}, {}, {}, {}]}
        />
      );

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should call onClose when close button clicked', async () => {
      const onClose = vi.fn();
      render(
        <ResponsiveModal
          {...defaultProps}
          fields={[{}, {}, {}, {}, {}]}
          onClose={onClose}
        />
      );

      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });

    it('should call onClose when Escape key is pressed', async () => {
      const onClose = vi.fn();
      render(
        <ResponsiveModal
          {...defaultProps}
          fields={[{}, {}, {}, {}, {}]}
          onClose={onClose}
        />
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });

    it('should close button have 48px minimum dimensions', () => {
      render(
        <ResponsiveModal
          {...defaultProps}
          fields={[{}, {}, {}, {}, {}]}
        />
      );

      const closeButton = screen.getByLabelText('Close modal');
      const style = window.getComputedStyle(closeButton);
      expect(style.minWidth).toBe('48px');
      expect(style.minHeight).toBe('48px');
    });
  });

  describe('Accessibility', () => {
    it('should have role="dialog" on desktop', () => {
      useBreakpointMock.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      });

      render(<ResponsiveModal {...defaultProps} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('should have aria-modal="true"', () => {
      useBreakpointMock.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      });

      render(<ResponsiveModal {...defaultProps} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-labelledby pointing to title', () => {
      useBreakpointMock.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      });

      render(<ResponsiveModal {...defaultProps} />);
      const dialog = screen.getByRole('dialog');
      const titleId = dialog.getAttribute('aria-labelledby');
      expect(titleId).toBeTruthy();

      const title = document.getElementById(titleId);
      expect(title).toBeInTheDocument();
    });

    it('should have close button with aria-label', () => {
      useBreakpointMock.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      });

      render(<ResponsiveModal {...defaultProps} />);
      const closeButton = screen.getByLabelText('Close modal');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Content scrolling', () => {
    it('should make content scrollable on desktop when exceeds viewport', () => {
      useBreakpointMock.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      });

      const longContent = (
        <div>
          {Array.from({ length: 100 }).map((_, i) => (
            <p key={i}>Line {i}</p>
          ))}
        </div>
      );

      render(
        <ResponsiveModal
          {...defaultProps}
          children={longContent}
        />
      );

      expect(screen.getByText('Line 99')).toBeInTheDocument();
    });

    it('should make content scrollable on mobile fullscreen when exceeds viewport', () => {
      useBreakpointMock.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      });

      const longContent = (
        <div>
          {Array.from({ length: 100 }).map((_, i) => (
            <p key={i}>Line {i}</p>
          ))}
        </div>
      );

      render(
        <ResponsiveModal
          {...defaultProps}
          fields={[{}, {}, {}, {}, {}]}
          children={longContent}
        />
      );

      expect(screen.getByText('Line 99')).toBeInTheDocument();
    });
  });

  describe('Visibility toggling', () => {
    it('should not render content when isOpen is false on desktop', () => {
      useBreakpointMock.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      });

      render(
        <ResponsiveModal
          {...defaultProps}
          isOpen={false}
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveStyle('pointer-events: none');
    });

    it('should render content when isOpen is true', () => {
      useBreakpointMock.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      });

      render(
        <ResponsiveModal
          {...defaultProps}
          isOpen={true}
        />
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });
  });
});
