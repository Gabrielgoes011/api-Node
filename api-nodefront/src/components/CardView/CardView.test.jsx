import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import CardView from './CardView';

const columns = [
  { titulo: 'Ticker',    acesso: 'ticker' },
  { titulo: 'Nome',      acesso: 'nome' },
  { titulo: 'Segmento',  acesso: 'segmento' },
];

const sampleData = [
  { ticker: 'HGLG11', nome: 'CSHG Logística',  segmento: 'Logística' },
  { ticker: 'XPML11', nome: 'XP Malls',         segmento: 'Shopping' },
  { ticker: 'KNRI11', nome: 'Kinea Renda Imob.', segmento: 'Híbrido' },
];

describe('CardView — data rendering', () => {
  it('renders a card for each data row', () => {
    render(
      <CardView
        coluna={columns}
        data={sampleData}
        primaryFields={['ticker']}
        secondaryFields={['nome', 'segmento']}
      />
    );
    // Each card is an <article>
    const cards = document.querySelectorAll('article');
    expect(cards).toHaveLength(sampleData.length);
  });

  it('displays primary field values in card headers', () => {
    render(
      <CardView
        coluna={columns}
        data={sampleData}
        primaryFields={['ticker']}
        secondaryFields={['nome', 'segmento']}
      />
    );
    expect(screen.getByText('HGLG11')).toBeInTheDocument();
    expect(screen.getByText('XPML11')).toBeInTheDocument();
    expect(screen.getByText('KNRI11')).toBeInTheDocument();
  });

  it('displays secondary field values in card body', () => {
    render(
      <CardView
        coluna={columns}
        data={sampleData}
        primaryFields={['ticker']}
        secondaryFields={['nome', 'segmento']}
      />
    );
    expect(screen.getByText('CSHG Logística')).toBeInTheDocument();
    expect(screen.getByText('Logística')).toBeInTheDocument();
  });

  it('shows "Nenhum registro encontrado" when data is empty', () => {
    render(<CardView coluna={columns} data={[]} />);
    expect(screen.getByText('Nenhum registro encontrado')).toBeInTheDocument();
  });
});

describe('CardView — search functionality', () => {
  it('filters cards based on search input (after debounce)', async () => {
    render(
      <CardView
        coluna={columns}
        data={sampleData}
        primaryFields={['ticker']}
        secondaryFields={['nome', 'segmento']}
        labelpesquisa="Buscar fundo..."
      />
    );

    const input = screen.getByPlaceholderText('Buscar fundo...');
    fireEvent.change(input, { target: { value: 'HGLG' } });

    // Wait for 300ms debounce
    await waitFor(
      () => {
        const cards = document.querySelectorAll('article');
        expect(cards).toHaveLength(1);
      },
      { timeout: 500 }
    );
  });

  it('shows result count when search is active', async () => {
    render(
      <CardView
        coluna={columns}
        data={sampleData}
        primaryFields={['ticker']}
        secondaryFields={['nome', 'segmento']}
        labelpesquisa="Buscar..."
      />
    );

    const input = screen.getByPlaceholderText('Buscar...');
    fireEvent.change(input, { target: { value: 'Shopping' } });

    await waitFor(
      () => expect(screen.getByText(/1 resultado encontrado/i)).toBeInTheDocument(),
      { timeout: 500 }
    );
  });

  it('shows empty state message when search yields no results', async () => {
    render(
      <CardView
        coluna={columns}
        data={sampleData}
        primaryFields={['ticker']}
        secondaryFields={['nome', 'segmento']}
        labelpesquisa="Buscar..."
      />
    );

    const input = screen.getByPlaceholderText('Buscar...');
    fireEvent.change(input, { target: { value: 'zzznomatch' } });

    await waitFor(
      () => expect(screen.getByText('Nenhum registro encontrado')).toBeInTheDocument(),
      { timeout: 500 }
    );
  });
});

describe('CardView — pagination', () => {
  it('paginates data and shows only itemsPerPage cards', () => {
    const bigData = Array.from({ length: 15 }, (_, i) => ({
      ticker: `FII${i}`,
      nome:   `Fundo ${i}`,
      segmento: 'Logística',
    }));

    render(
      <CardView
        coluna={columns}
        data={bigData}
        itemsPerPage={5}
        primaryFields={['ticker']}
        secondaryFields={['nome', 'segmento']}
      />
    );

    const cards = document.querySelectorAll('article');
    expect(cards).toHaveLength(5);
    expect(screen.getByText(/Página 1 de 3/i)).toBeInTheDocument();
  });

  it('navigates to next page on "Próxima" click', () => {
    const bigData = Array.from({ length: 6 }, (_, i) => ({
      ticker: `FII${i}`,
      nome:   `Fundo ${i}`,
      segmento: 'Logística',
    }));

    render(
      <CardView
        coluna={columns}
        data={bigData}
        itemsPerPage={3}
        primaryFields={['ticker']}
        secondaryFields={['nome', 'segmento']}
      />
    );

    fireEvent.click(screen.getByLabelText('Próxima página'));
    expect(screen.getByText(/Página 2 de 2/i)).toBeInTheDocument();
  });
});

describe('CardView — action handlers', () => {
  it('renders ActionMenu trigger button when actions are configured', () => {
    const handleEdit = vi.fn();
    render(
      <CardView
        coluna={columns}
        data={sampleData}
        primaryFields={['ticker']}
        secondaryFields={['nome', 'segmento']}
        usaEditar
        acaoEditar={handleEdit}
      />
    );

    const menuButtons = screen.getAllByLabelText('Abrir menu de ações');
    expect(menuButtons).toHaveLength(sampleData.length);
  });
});

describe('CardView — accessibility', () => {
  it('search input has an accessible label', () => {
    render(
      <CardView
        coluna={columns}
        data={sampleData}
        labelpesquisa="Buscar fundo..."
      />
    );
    expect(screen.getByRole('textbox', { name: 'Buscar fundo...' })).toBeInTheDocument();
  });

  it('card list has role="list"', () => {
    render(<CardView coluna={columns} data={sampleData} />);
    expect(screen.getByRole('list', { name: /lista de registros/i })).toBeInTheDocument();
  });
});
