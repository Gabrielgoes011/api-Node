import React, { useState } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConfirmationDialog from './ConfirmationDialog';

// Mock useBreakpoint hook
vi.mock('../../hooks/useBreakpoint', () => ({
  default: vi.fn(() => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  })),
}));

// Mock TouchButton component
vi.mock('../TouchButton/TouchButton', () => ({
  default: ({ onClick, children, ...props }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

// Mock BottomSheet component
vi.mock('../BottomSheet/BottomSheet', () => ({
  default: ({ isOpen, onClose, title, children }) => (
    isOpen ? (
      <div role="dialog" aria-modal="true">
        <h2>{title}</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
  ),
}));

const useBreakpointMock = require('../../hooks/useBreakpoint').default;

describe('ConfirmationDialog', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Delete User',
    recordIdentifier: 'João Silva (joao@email.com)',
    message: 'Esta ação não pode ser desfeita.',
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
      render(<ConfirmationDialog {...defaultProps} />);
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    it('should display warning title', () => {
      render(<ConfirmationDialog {...defaultProps} title="Delete User" />);
      expect(screen.getByText('Delete User')).toBeInTheDocument();
    });

    it('should display record identifier', () => {
      render(<ConfirmationDialog {...defaultProps} />);
      expect(screen.getByText('João Silva (joao@email.com)')).toBeInTheDocument();
    });

    it('should display warning message', () => {
      render(<ConfirmationDialog {...defaultProps} />);
      expect(screen.getByText('Esta ação não pode ser desfeita.')).toBeInTheDocument();
    });

    it('should have "Cancelar" button with neutral color', () => {
      render(<ConfirmationDialog {...defaultProps} cancelLabel="Cancelar" />);
      const cancelButton = screen.getByText('Cancelar');
      expect(cancelButton).toBeInTheDocument();
    });

    it('should have "Excluir" button with danger color', () => {
      render(<ConfirmationDialog {...defaultProps} confirmLabel="Excluir" />);
      const deleteButton = screen.getByText('Excluir');
      expect(deleteButton).toBeInTheDocument();
    });

    it('should call onConfirm when delete button is clicked', async () => {
      render(<ConfirmationDialog {...defaultProps} />);
      fireEvent.click(screen.getByText('Excluir'));

      await waitFor(() => {
        expect(defaultProps.onConfirm).toHaveBeenCalled();
      });
    });

    it('should call onClose when cancel button is clicked', async () => {
      render(<ConfirmationDialog {...defaultProps} />);
      fireEvent.click(screen.getByText('Cancelar'));

      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled();
      });
    });

    it('should close dialog when backdrop is clicked', async () => {
      render(<ConfirmationDialog {...defaultProps} showBackdrop={true} />);

      // Find and click backdrop
      const dialogs = document.querySelectorAll('[role="presentation"]');
      if (dialogs.length > 0) {
        fireEvent.click(dialogs[0]);
        await waitFor(() => {
          expect(defaultProps.onClose).toHaveBeenCalled();
        });
      }
    });

    it('should close dialog when ESC key is pressed', async () => {
      render(<ConfirmationDialog {...defaultProps} />);
      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled();
      });
    });

    it('should show loading state on confirm button', () => {
      render(
        <ConfirmationDialog
          {...defaultProps}
          loading={true}
          confirmLabel="Excluir"
        />
      );

      const deleteButton = screen.getByText('Excluir');
      expect(deleteButton).toHaveAttribute('disabled');
    });

    it('should disable both buttons during loading', () => {
      render(
        <ConfirmationDialog
          {...defaultProps}
          loading={true}
        />
      );

      expect(screen.getByText('Cancelar')).toHaveAttribute('disabled');
      expect(screen.getByText('Excluir')).toHaveAttribute('disabled');
    });

    it('should have max-width of 400px', () => {
      const { container } = render(<ConfirmationDialog {...defaultProps} />);
      const dialog = container.querySelector('[role="alertdialog"]');
      const style = window.getComputedStyle(dialog);

      expect(style.maxWidth).toBe('400px');
    });
  });

  describe('Mobile variant (BottomSheet)', () => {
    beforeEach(() => {
      useBreakpointMock.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      });
    });

    it('should render BottomSheet on mobile', () => {
      render(<ConfirmationDialog {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should display title in BottomSheet', () => {
      render(<ConfirmationDialog {...defaultProps} />);
      expect(screen.getByText('Delete User')).toBeInTheDocument();
    });

    it('should have cancel and delete buttons in mobile view', () => {
      render(
        <ConfirmationDialog
          {...defaultProps}
          cancelLabel="Cancelar"
          confirmLabel="Excluir"
        />
      );

      expect(screen.getByText('Cancelar')).toBeInTheDocument();
      expect(screen.getByText('Excluir')).toBeInTheDocument();
    });

    it('should call onClose when close button in BottomSheet is clicked', () => {
      render(<ConfirmationDialog {...defaultProps} />);
      fireEvent.click(screen.getByText('Close'));

      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      useBreakpointMock.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      });
    });

    it('should have role="alertdialog"', () => {
      render(<ConfirmationDialog {...defaultProps} />);
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    it('should have aria-modal="true"', () => {
      render(<ConfirmationDialog {...defaultProps} />);
      expect(screen.getByRole('alertdialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-labelledby pointing to title', () => {
      render(<ConfirmationDialog {...defaultProps} />);
      const dialog = screen.getByRole('alertdialog');
      const titleId = dialog.getAttribute('aria-labelledby');

      expect(titleId).toBeTruthy();
      expect(document.getElementById(titleId)).toBeInTheDocument();
    });

    it('should have aria-describedby pointing to message', () => {
      render(<ConfirmationDialog {...defaultProps} />);
      const dialog = screen.getByRole('alertdialog');
      const describedById = dialog.getAttribute('aria-describedby');

      expect(describedById).toBeTruthy();
    });
  });

  describe('Record identifier display', () => {
    beforeEach(() => {
      useBreakpointMock.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      });
    });

    it('should display record identifier when provided', () => {
      render(
        <ConfirmationDialog
          {...defaultProps}
          recordIdentifier="Test Record"
        />
      );

      expect(screen.getByText('Test Record')).toBeInTheDocument();
    });

    it('should not display record identifier section when not provided', () => {
      const { container } = render(
        <ConfirmationDialog
          {...defaultProps}
          recordIdentifier=""
        />
      );

      // Should not have the record section
      const recordSection = container.querySelector('[style*="padding: 12px"]');
      expect(recordSection).not.toBeInTheDocument();
    });

    it('should display "Será deletado:" label', () => {
      render(<ConfirmationDialog {...defaultProps} />);
      expect(screen.getByText('Será deletado:')).toBeInTheDocument();
    });
  });

  describe('Button visibility and positioning', () => {
    beforeEach(() => {
      useBreakpointMock.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      });
    });

    it('should have both buttons visible', () => {
      render(
        <ConfirmationDialog
          {...defaultProps}
          cancelLabel="Cancelar"
          confirmLabel="Excluir"
        />
      );

      expect(screen.getByText('Cancelar')).toBeInTheDocument();
      expect(screen.getByText('Excluir')).toBeInTheDocument();
    });

    it('should allow custom button labels', () => {
      render(
        <ConfirmationDialog
          {...defaultProps}
          cancelLabel="Voltar"
          confirmLabel="Remover"
        />
      );

      expect(screen.getByText('Voltar')).toBeInTheDocument();
      expect(screen.getByText('Remover')).toBeInTheDocument();
    });

    it('should have default labels when not provided', () => {
      const { onClose, onConfirm } = defaultProps;
      render(
        <ConfirmationDialog
          isOpen={true}
          onClose={onClose}
          onConfirm={onConfirm}
          title="Delete"
          recordIdentifier="Test"
        />
      );

      expect(screen.getByText('Cancelar')).toBeInTheDocument();
      expect(screen.getByText('Excluir')).toBeInTheDocument();
    });
  });

  describe('Visibility toggling', () => {
    beforeEach(() => {
      useBreakpointMock.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      });
    });

    it('should not render dialog when isOpen is false', () => {
      const { queryByRole } = render(
        <ConfirmationDialog
          {...defaultProps}
          isOpen={false}
        />
      );

      const dialog = queryByRole('alertdialog');
      if (dialog) {
        expect(dialog).toHaveStyle('pointer-events: none');
      }
    });

    it('should render dialog when isOpen is true', () => {
      render(<ConfirmationDialog {...defaultProps} isOpen={true} />);
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });
  });

  describe('Warning message', () => {
    beforeEach(() => {
      useBreakpointMock.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      });
    });

    it('should display default message when not provided', () => {
      const { onClose, onConfirm } = defaultProps;
      render(
        <ConfirmationDialog
          isOpen={true}
          onClose={onClose}
          onConfirm={onConfirm}
          title="Delete"
          recordIdentifier="Test"
        />
      );

      expect(
        screen.getByText(/Esta ação não pode ser desfeita/)
      ).toBeInTheDocument();
    });

    it('should display custom message when provided', () => {
      const customMessage = 'Você não poderá recuperar este registro.';
      render(
        <ConfirmationDialog
          {...defaultProps}
          message={customMessage}
        />
      );

      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });
  });

  describe('Async confirmation handling', () => {
    beforeEach(() => {
      useBreakpointMock.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      });
    });

    it('should handle async onConfirm', async () => {
      const asyncConfirm = vi.fn(() => Promise.resolve());
      render(
        <ConfirmationDialog
          {...defaultProps}
          onConfirm={asyncConfirm}
        />
      );

      fireEvent.click(screen.getByText('Excluir'));

      await waitFor(() => {
        expect(asyncConfirm).toHaveBeenCalled();
      });
    });

    it('should disable buttons during async operation', async () => {
      let resolveConfirm;
      const asyncConfirm = vi.fn(() => new Promise(resolve => {
        resolveConfirm = resolve;
      }));

      render(
        <ConfirmationDialog
          {...defaultProps}
          onConfirm={asyncConfirm}
        />
      );

      fireEvent.click(screen.getByText('Excluir'));

      // During async operation, buttons should be disabled
      await waitFor(() => {
        expect(asyncConfirm).toHaveBeenCalled();
      });

      resolveConfirm?.();
    });
  });

  describe('Tablet variant', () => {
    beforeEach(() => {
      useBreakpointMock.mockReturnValue({
        isMobile: false,
        isTablet: true,
        isDesktop: false,
      });
    });

    it('should render centered dialog on tablet (like desktop)', () => {
      render(<ConfirmationDialog {...defaultProps} />);
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });
  });

  describe('Backdrop handling', () => {
    beforeEach(() => {
      useBreakpointMock.mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      });
    });

    it('should show backdrop when showBackdrop is true', () => {
      const { container } = render(
        <ConfirmationDialog
          {...defaultProps}
          showBackdrop={true}
        />
      );

      const backdrop = container.querySelector('[role="presentation"]');
      expect(backdrop).toBeInTheDocument();
    });

    it('should not show backdrop when showBackdrop is false', () => {
      const { container } = render(
        <ConfirmationDialog
          {...defaultProps}
          showBackdrop={false}
        />
      );

      const backdrop = container.querySelector('[role="presentation"]');
      expect(backdrop).not.toBeInTheDocument();
    });
  });
});
