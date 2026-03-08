export const formatarDataBR = (data) => {
  if (!data) return '';
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR');
};

export const formatarDataComHora = (data) => {
  if (!data) return '';
  const d = new Date(data);
  return d.toLocaleString('pt-BR');
};