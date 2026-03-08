import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  dados: any[];
  itemsPerPage: number;
  onItemsPerPageChange: (novoValor: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, setCurrentPage, dados, itemsPerPage, onItemsPerPageChange }) => {
  return (
    <nav>
      <ul className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(page)}>
              {page}
            </button>
          </li>
        ))}
      </ul>
      <div>
        <label>Itens por página:</label>
        <select value={itemsPerPage} onChange={(e) => onItemsPerPageChange(Number(e.target.value))}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
    </nav>
  );
};

export default Pagination;