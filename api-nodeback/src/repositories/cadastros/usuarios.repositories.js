import { openDb } from "../../config/configDb.js";

//#region => Query para listar os usuários cadastrados
async function listarUsuariosRepository(blvalor) {

  //abre a conexão com o banco de dados
  const db = await openDb();

  //Executa a consulta SQL para listar os usuários
  const resultado = await db.query(`        
        SELECT
          id, nome, cpf, email, ativo,
          EXTRACT(YEAR FROM AGE("dataNascimento")) idade
        FROM usuarios   
        WHERE ativo = $1 
        ORDER BY id DESC `, [blvalor]
  );

  //retorna os resultados da consulta
  return resultado.rows;
}
//#endregion

export {
  listarUsuariosRepository
}