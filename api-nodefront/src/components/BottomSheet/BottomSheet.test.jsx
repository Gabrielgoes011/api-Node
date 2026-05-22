import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import BottomSheet from './BottomSheet';

describe('BottomSheet — open/close behavior', () => {
  it('renders children when isOpen=true', () => {
    render(
      <BottomSheet isOpen={true} onClose={vi.fn()} title="Ações">
        <p>Conteúdo do sheet</p>
      </BottomSheet>
    );
    expect(screen.getByText('Conteúdo do sheet')).toBeInTheDocument();
  });

  it('renders children even when isOpen=false (kept in DOM for animation)', () => {
    render(
      <BottomSheet isOpen={false} onClose={vi.fn()} title="Ações">
        <p>Conteúdo oculto</p>
      </BottomSheet>
    );
    // Component keeps DOM mounted for close animation
    expect(screen.getByText('Conteúdo oculto')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <BottomSheet isOpen={true} onClose={onClose} title="Ações">
        <p>Conteúdo</p>
      </BottomSheet>
    );
    fireEvent.click(screen.getByLabelText('Fechar'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <BottomSheet isOpen={true} onClose={onClose} title="Ações">
        <p>Conteúdo</p>
      </BottomSheet>
    );
    // Backdrop is the first child (aria-hidden div)
    const backdrop = container.querySelector('[aria-hidden="true"]');
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when ESC key is pressed', () => {
    const onClose = vi.fn();
    render(
      <BottomSheet isOpen={true} onClose={onClose} title="Ações">
        <p>Conteúdo</p>
      </BottomSheet>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('BottomSheet — accessibility', () => {
  it('has role="dialog" and aria-modal="true"', () => {
    render(
      <BottomSheet isOpen={true} onClose={vi.fn()} title="Ações">
        <p>Conteúdo</p>
      </BottomSheet>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('has aria-labelledby pointing to the title element', () => {
    render(
      <BottomSheet isOpen={true} onClose={vi.fn()} title="Meu Título">
        <p>Conteúdo</p>
      </BottomSheet>
    );
    const dialog = screen.getByRole('dialog');
    const labelledById = dialog.getAttribute('aria-labelledby');
    expect(labelledById).toBeTruthy();
    const titleEl = document.getElementById(labelledById);
    expect(titleEl).toBeInTheDocument();
    expect(titleEl.textContent).toBe('Meu Título');
  });

  it('displays the title in the header', () => {
    render(
      <BottomSheet isOpen={true} onClose={vi.fn()} title="Ações do Registro">
        <p>Conteúdo</p>
      </BottomSheet>
    );
    expect(screen.getByText('Ações do Registro')).toBeInTheDocument();
  });

  it('close button has aria-label="Fechar"', () => {
    render(
      <BottomSheet isOpen={true} onClose={vi.fn()} title="Ações">
        <p>Conteúdo</p>
      </BottomSheet>
    );
    expect(screen.getByLabelText('Fechar')).toBeInTheDocument();
  });
});

describe('BottomSheet — touch target size', () => {
  it('close button has minimum 48px touch target', () => {
    render(
      <BottomSheet isOpen={true} onClose={vi.fn()} title="Ações">
        <p>Conteúdo</p>
      </BottomSheet>
    );
    const closeBtn = screen.getByLabelText('Fechar');
    const style = closeBtn.style;
    // minWidth and minHeight are set inline
    expect(style.minWidth).toBe('48px');
    expect(style.minHeight).toBe('48px');
  });
});
