import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import ActionMenu from './ActionMenu';

const sampleItem = { ticker: 'HGLG11', nome: 'CSHG Logística' };

const sampleActions = [
  {
    type: 'visualizar',
    handler: vi.fn(),
    label: 'Visualizar',
    icon: AiOutlineEye,
    color: '#06b6d4',
  },
  {
    type: 'editar',
    handler: vi.fn(),
    label: 'Editar',
    icon: AiOutlineEdit,
    color: '#10b981',
  },
  {
    type: 'excluir',
    handler: vi.fn(),
    label: 'Excluir',
    icon: AiOutlineDelete,
    color: '#ef4444',
    requiresConfirmation: true,
  },
];

describe('ActionMenu — trigger button', () => {
  it('renders the vertical ellipsis trigger button', () => {
    render(<ActionMenu item={sampleItem} actions={sampleActions} itemIdentifier="ticker" />);
    expect(screen.getByLabelText('Abrir menu de ações')).toBeInTheDocument();
  });

  it('trigger button has minimum 48px touch target', () => {
    render(<ActionMenu item={sampleItem} actions={sampleActions} itemIdentifier="ticker" />);
    const btn = screen.getByLabelText('Abrir menu de ações');
    expect(btn.style.minWidth).toBe('48px');
    expect(btn.style.minHeight).toBe('48px');
  });
});

describe('ActionMenu — BottomSheet interaction', () => {
  it('opens BottomSheet when trigger is clicked', () => {
    render(<ActionMenu item={sampleItem} actions={sampleActions} itemIdentifier="ticker" />);
    fireEvent.click(screen.getByLabelText('Abrir menu de ações'));
    // BottomSheet should now show the action labels
    expect(screen.getByText('Visualizar')).toBeInTheDocument();
    expect(screen.getByText('Editar')).toBeInTheDocument();
    expect(screen.getByText('Excluir')).toBeInTheDocument();
  });

  it('shows the item identifier in the BottomSheet header', () => {
    render(<ActionMenu item={sampleItem} actions={sampleActions} itemIdentifier="ticker" />);
    fireEvent.click(screen.getByLabelText('Abrir menu de ações'));
    expect(screen.getByText(/HGLG11/)).toBeInTheDocument();
  });

  it('executes action handler and closes sheet when a non-confirmation action is clicked', () => {
    const editHandler = vi.fn();
    const actions = [
      {
        type: 'editar',
        handler: editHandler,
        label: 'Editar',
        icon: AiOutlineEdit,
        color: '#10b981',
      },
    ];

    render(<ActionMenu item={sampleItem} actions={actions} itemIdentifier="ticker" />);
    fireEvent.click(screen.getByLabelText('Abrir menu de ações'));
    fireEvent.click(screen.getByText('Editar'));

    expect(editHandler).toHaveBeenCalledWith(sampleItem);
  });

  it('shows confirmation sheet for actions with requiresConfirmation=true', () => {
    render(<ActionMenu item={sampleItem} actions={sampleActions} itemIdentifier="ticker" />);
    fireEvent.click(screen.getByLabelText('Abrir menu de ações'));
    fireEvent.click(screen.getByText('Excluir'));

    // Confirmation sheet should appear
    expect(screen.getByText('Confirmar ação')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Confirmar')).toBeInTheDocument();
  });

  it('executes handler after confirmation', () => {
    const deleteHandler = vi.fn();
    const actions = [
      {
        type: 'excluir',
        handler: deleteHandler,
        label: 'Excluir',
        icon: AiOutlineDelete,
        color: '#ef4444',
        requiresConfirmation: true,
      },
    ];

    render(<ActionMenu item={sampleItem} actions={actions} itemIdentifier="ticker" />);
    fireEvent.click(screen.getByLabelText('Abrir menu de ações'));
    fireEvent.click(screen.getByText('Excluir'));
    fireEvent.click(screen.getByText('Confirmar'));

    expect(deleteHandler).toHaveBeenCalledWith(sampleItem);
  });

  it('does NOT execute handler when confirmation is cancelled', () => {
    const deleteHandler = vi.fn();
    const actions = [
      {
        type: 'excluir',
        handler: deleteHandler,
        label: 'Excluir',
        icon: AiOutlineDelete,
        color: '#ef4444',
        requiresConfirmation: true,
      },
    ];

    render(<ActionMenu item={sampleItem} actions={actions} itemIdentifier="ticker" />);
    fireEvent.click(screen.getByLabelText('Abrir menu de ações'));
    fireEvent.click(screen.getByText('Excluir'));
    fireEvent.click(screen.getByText('Cancelar'));

    expect(deleteHandler).not.toHaveBeenCalled();
  });
});

describe('ActionMenu — color coding', () => {
  it('applies correct color to each action type', () => {
    render(<ActionMenu item={sampleItem} actions={sampleActions} itemIdentifier="ticker" />);
    fireEvent.click(screen.getByLabelText('Abrir menu de ações'));

    const visualizarBtn = screen.getByLabelText('Visualizar');
    const editarBtn     = screen.getByLabelText('Editar');
    const excluirBtn    = screen.getByLabelText('Excluir');

    expect(visualizarBtn.style.color).toBe('rgb(6, 182, 212)');   // #06b6d4
    expect(editarBtn.style.color).toBe('rgb(16, 185, 129)');       // #10b981
    expect(excluirBtn.style.color).toBe('rgb(239, 68, 68)');       // #ef4444
  });
});
