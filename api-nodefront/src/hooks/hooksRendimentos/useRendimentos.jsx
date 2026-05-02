import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { rendimentosService } from '../../services/servRendimentos/rendimentosService';

export const useRendimentos = () => {
  const [rendimentos, setRendimentos] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRendimentos = useCallback(async ({ mes, ano }) => {
    setLoading(true);
    try {
      const data = await rendimentosService.listar({ mes, ano });
      setRendimentos(data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.error || 'Erro ao buscar rendimentos.'
      );
      setRendimentos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    rendimentos,
    loading,
    getRendimentos,
  };
};
