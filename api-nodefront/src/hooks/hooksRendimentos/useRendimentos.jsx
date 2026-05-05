import { useState, useCallback } from 'react';
import { handleError } from '../../utils/responseUtils';
import { rendimentosService } from '../../services/servRendimentos/rendimentosService';

export const useRendimentos = () => {
  const [rendimentos, setRendimentos]       = useState([]);
  const [detalheMensal, setDetalheMensal]   = useState([]); // [{ mes, ano, totalRendimento }]
  const [detalheAnual, setDetalheAnual]     = useState([]); // [{ ano, totalRendimento }]
  const [loading, setLoading]               = useState(false);
  const [loadingGrafico, setLoadingGrafico] = useState(false);

  // Busca a lista de rendimentos (tabela histórico)
  const getRendimentos = useCallback(async ({ mes, ano }) => {
    setLoading(true);
    try {
      const data = await rendimentosService.listar({ mes, ano });
      setRendimentos(data || []);
    } catch (error) {
      handleError(error, 'Erro ao buscar rendimentos.');
      setRendimentos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca dados dos gráficos vindos da API (mensal + anual)
  const getGrafico = useCallback(async ({ ano }) => {
    setLoadingGrafico(true);
    try {
      const data = await rendimentosService.dadosGrafico({ ano });
      setDetalheMensal(data?.detalheMensal || []);
      setDetalheAnual(data?.detalheAnual   || []);
    } catch (error) {
      handleError(error, 'Erro ao buscar dados do gráfico.');
    } finally {
      setLoadingGrafico(false);
    }
  }, []);

  return {
    rendimentos,
    detalheMensal,
    detalheAnual,
    loading,
    loadingGrafico,
    getRendimentos,
    getGrafico,
  };
};
