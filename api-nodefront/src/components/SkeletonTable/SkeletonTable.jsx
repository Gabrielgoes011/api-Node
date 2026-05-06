import React from 'react';

/**
 * SkeletonTable — linhas animadas para exibir enquanto a tabela carrega.
 * Props:
 *  - rows?: number    — quantidade de linhas (default 5)
 *  - cols?: number    — quantidade de colunas (default 4)
 */
export default function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <>
      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
      `}</style>
      <div style={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden', backgroundColor: '#ffffff' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {[...Array(rows)].map((_, ri) => (
              <tr key={ri} style={{ borderBottom: '1px solid #f1f5f9' }}>
                {[...Array(cols)].map((_, ci) => (
                  <td key={ci} style={{ padding: '1rem' }}>
                    <div style={{
                      height: '14px',
                      width: ci === 0 ? '60%' : ci === cols - 1 ? '40%' : '80%',
                      backgroundColor: '#e2e8f0',
                      borderRadius: '4px',
                      animation: 'skeletonPulse 1.5s ease-in-out infinite',
                      animationDelay: `${ri * 0.07}s`,
                    }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
