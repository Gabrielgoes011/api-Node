import { openDb } from "../../config/configDb.js";
import { 
  listarFundosService,
  cadastrarFundosService
 } from "../../services/cadastros/meusFundos.services.js";


//#region => cadastrar meus fundos
export async function cadastrarFundos(req, res) {
  //recebe os dados do corpo da requisição
  const dados = req.body;

  try {

    // Chama a função do serviço para cadastrar os fundos
    const cadastrarFundos = await cadastrarFundosService(dados);

    // Retorna os resultados da consulta em formato JSON
    return res.status(201).json({
      message: 'Fundo cadastrado com sucesso',
      fundo: cadastrarFundos
    });

  } catch (error) {

    // Log do erro para depuração
    console.error('Erro ao cadastrar fundos:',error);

    // Retorna um erro genérico para o client
    return res.status(400).json({ error: error.message });
  }
}
//#endregion

//#region função listar fundos -  
export async function listarFundos(req, res) {
  try {

    // Chama a função do repositório para listar os fundos
    const listarFundos = await listarFundosService();

    // Retorna os resultados da consulta em formato JSON
    res.status(200).json(listarFundos);

  } catch (error) {
    // Log do erro para depuração
    console.error('Erro ao listar fundos:', error);

    // Retorna um erro genérico para o cliente
    return res.status(500).json({ error: 'Erro ao listar fundos.' });

  }
}

//#endregion

//#region função de contar fundos ativos
export async function contarFundosAtivos(req, res) {
  const db = await openDb();
  try {
    const resultado = await db.query(`
        SELECT COUNT(*) AS total
        FROM ativos
    `);
    res.status(200).json({ total: parseInt(resultado.rows[0].total, 10) });
  } catch (error) {
    console.error('Erro ao contar fundos ativos:', error);
    res.status(500).json({ error: 'Erro ao contar fundos ativos.' });
  }
}
//#endregion
