import {
  listarUsuariosRepository
} from "../../repositories/cadastros/usuarios.repositories.js";

//  #region => Service para listar os usuários cadastrados
async function listarUsuariosService(blvalor) {

  //verifica se o valor do parâmetro "status" é válido
  if (blvalor !== 'on' && blvalor !== 'off') {
    throw new Error(
      'O valor do parâmetro "status" deve ser "on" ou "off"');
  }

  //converte o valor do parâmetro para booleano
  if (blvalor === 'on') {
    blvalor = true;
  } else {
    blvalor = false;
  }

  //Chama a função do repositório para listar os usuários
  const listarUsuarios = await listarUsuariosRepository(blvalor);

  //verifica se a lista de usuários está vazia
  if (listarUsuarios.length === 0) {
    return [], 'Nenhum usuário encontrado com o status informado';
  }

  //retorna lista de usuários
  return listarUsuarios;
}
//#endregion

export {
  listarUsuariosService
}