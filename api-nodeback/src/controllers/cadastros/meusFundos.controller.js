import { openDb } from "../../config/configDb.js";
import { listarFundosRepository } from "../../repositories/cadastros/meuFundos.repositories.js";
import { listarFundosService } from "../../services/cadastros/meusFundos.services.js";


//cadastrar meus fundos
export async function cadastrarFundos(req, res) {
  const dados = req.body;
  const db = await openDb();

  if (!dados.ticker) {
    return res.status(400).json({ error: 'O campo ticker nao pode ser vazio' });
  }

  // Verificar se o ticker já existe no banco de dados
  const existeTicker = await db.query(`
      SELECT id 
      FROM ativos
      WHERE ticker = $1 `, [dados.ticker]
  );

  // Se o ticker já existir, retornar um erro
  if (existeTicker.rows.length > 0) {
    return res.status(400).json({ error: 'O ticker informado já está cadastrado' });
  }

  try {
    const insertFundos = await db.query(`
        INSERT INTO ativos
          ("ticker", "nomeFundo", cnpj, "idSeguimento", "dtCadastro")
        VALUES 
          ($1, $2, $3, $4, now())
        RETURNING id`,
      [dados.ticker, dados.nomeFundo, dados.cnpj, dados.idSeguimento]
    );

    // Retornar o ID do fundo cadastrado
    return res.status(201).json({ message: 'Fundo cadastrado com sucesso! ' });

  } catch (error) {

    // Retornar um erro detalhado em caso de falha na inserção
    return res.status(500).json({ error: 'Erro ao inserir o fundo.', errorDetails: error.message });
  }
}


//#region função listar fundos -  (ativos/inativos)
export async function listarFundos(req, res) {
  try {

    // Chama a função do repositório para listar os fundos
    const listarFundos = 
      await listarFundosService();

    // Retorna os resultados da consulta em formato JSON
    res.status(200).json(listarFundos);

  //
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
