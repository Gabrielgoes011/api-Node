import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// ── Mock useBreakpoint so we can control the breakpoint in tests ──────────────
vi.mock('../../hooks/useBreakpoint');
import useBreakpoint from '../../hooks/useBreakpoint';

// ── Mock TableAcoes and CardView with identifiable test-ids ───────────────────
vi.mock('../TableAcoes', () => ({
  TableAcoes: (props) => (
    <div data-testid="table-acoes">TableAcoes mock</div>
  ),
}));

vi.mock('../CardView/CardView', () => ({
  default: (props) => (
    <div data-testid="card-view">CardView mock</div>
  ),
}));

import ResponsiveTable from './ResponsiveTable';

const sampleColumns = [
  { titulo: 'Ticker', acesso: 'ticker' },
  { titulo: 'Nome',   acesso: 'nome' },
];

const sampleData = [
  { ticker: 'HGLG11', nome: 'CSHG Logística' },
  { ticker: 'XPML11', nome: 'XP Malls' },
];

describe('ResponsiveTable — responsive switching', () => {
  it('renders TableAcoes when isDesktop=true', () => {
    useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true });
    render(<ResponsiveTable coluna={sampleColumns} data={sampleData} />);
    expect(screen.getByTestId('table-acoes')).toBeInTheDocument();
    expect(screen.queryByTestId('card-view')).not.toBeInTheDocument();
  });

  it('renders TableAcoes when isTablet=true', () => {
    useBreakpoint.mockReturnValue({ isMobile: false, isTablet: true, isDesktop: false });
    render(<ResponsiveTable coluna={sampleColumns} data={sampleData} />);
    expect(screen.getByTestId('table-acoes')).toBeInTheDocument();
    expect(screen.queryByTestId('card-view')).not.toBeInTheDocument();
  });

  it('renders CardView when isMobile=true', () => {
    useBreakpoint.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false });
    render(<ResponsiveTable coluna={sampleColumns} data={sampleData} />);
    expect(screen.getByTestId('card-view')).toBeInTheDocument();
    expect(screen.queryByTestId('table-acoes')).not.toBeInTheDocument();
  });

  it('falls back to TableAcoes when all breakpoints are false (SSR / matchMedia unavailable)', () => {
    useBreakpoint.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: false });
    render(<ResponsiveTable coluna={sampleColumns} data={sampleData} />);
    expect(screen.getByTestId('table-acoes')).toBeInTheDocument();
    expect(screen.queryByTestId('card-view')).not.toBeInTheDocument();
  });
});
