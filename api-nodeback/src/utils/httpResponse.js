/**
 * Funções padrão para respostas HTTP
 * Centraliza todas as respostas da API com formato consistente
 */

/**
 * Enviar resposta genérica
 * @param {Object} res - Objeto de resposta do Express
 * @param {number} statusCode - Código HTTP
 * @param {string} message - Mensagem da resposta
 * @param {Object} data - Dados adicionais (opcional)
 */
export function sendResponse(res, statusCode, message, data = null) {
  const response = { status: statusCode, message };
  if (data) response.data = data;
  return res.status(statusCode).json(response);
}

// ========== RESPOSTAS DE SUCESSO (2xx) ==========

export const success = {
  ok: (res, message = 'Sucesso!', data) => 
    sendResponse(res, 200, message, data),
  
  created: (res, message = 'Recurso criado com sucesso!', data) => 
    sendResponse(res, 201, message, data),
};

// ========== RESPOSTAS DE ERRO DO CLIENTE (4xx) ==========

export const error = {
  badRequest: (res, message = 'Requisição inválida!') => 
    sendResponse(res, 400, message),
  
  unauthorized: (res, message = 'Não autorizado!') => 
    sendResponse(res, 401, message),
  
  forbidden: (res, message = 'Acesso proibido!') => 
    sendResponse(res, 403, message),
  
  notFound: (res, message = 'Recurso não encontrado!') => 
    sendResponse(res, 404, message),
  
  conflict: (res, message = 'Conflito com dados existentes!') => 
    sendResponse(res, 409, message),
};

// ========== RESPOSTAS DE ERRO DO SERVIDOR (5xx) ==========

export const serverError = {
  internalError: (res, message = 'Erro interno do servidor!') => 
    sendResponse(res, 500, message),
  
  serviceUnavailable: (res, message = 'Serviço indisponível!') => 
    sendResponse(res, 503, message),
};

// ========== RESPOSTAS PERSONALIZADAS (CASOS ESPECÍFICOS) ==========

export const custom = {
  usuarioAtualizado: (res, data) => 
    success.ok(res, 'Usuário atualizado com sucesso!', data),
  
  usuarioCriado: (res, data) => 
    success.created(res, 'Usuário criado com sucesso!', data),
  
  usuarioNaoEncontrado: (res) => 
    error.notFound(res, 'Usuário não encontrado.'),
  
  emailJaCadastrado: (res) => 
    error.conflict(res, 'Email já cadastrado!'),
  
  camposObrigatorios: (res) => 
    error.badRequest(res, 'Insira todos os campos obrigatórios!'),
  
  emailInvalido: (res) => 
    error.badRequest(res, 'Email inválido!'),
  
  nomeInvalido: (res) => 
    error.badRequest(res, 'Insira o nome e sobrenome!'),
};
