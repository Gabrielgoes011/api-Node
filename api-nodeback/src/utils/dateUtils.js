

// Função para converter data de DD/MM/AAAA para YYYY-MM-DD
function converterDataParaPostgres(dataString) {
  if (!dataString) return null;
  const partes = dataString.split('/');
  if (partes.length !== 3) return null;
  const [dia, mes, ano] = partes;
  return `${ano}-${mes}-${dia}`;
}

export { converterDataParaPostgres };