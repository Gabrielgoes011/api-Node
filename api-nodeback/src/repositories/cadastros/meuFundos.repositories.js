import { openDb } from "../../config/configDb.js";

//Query para listar os fundos cadastrados
export async function listarFundosRepository() {

    //abre a conexão com o banco de dados
    const db = await openDb();


    //Executa a consulta SQL para listar os fundos
    const resultadoFundos = await db.query(`
        SELECT
            a.ticker,
            a."nomeFundo",
            a.cnpj,
            b."nomeSeguimento",
            a."idUsuario",
            a."dtCadastro" 
        FROM ativos a INNER JOIN seguimentos b 
        ON a."idSeguimento" = b.id
     `
    );

    //retorna os resultados da consulta
    return resultadoFundos.rows;
    
}   



