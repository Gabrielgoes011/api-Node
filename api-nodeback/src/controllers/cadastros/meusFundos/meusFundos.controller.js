import { openDb } from "../../../config/configDb.js";


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
  const db = await openDb();
  try {
    const resultado = await db.query(`        
        SELECT
          a.ticker, a."nomeFundo", a.cnpj,
          b."nomeSeguimento", a."idUsuario", a."dtCadastro" 
        FROM ativos a INNER JOIN seguimentos b 
        ON a."idSeguimento" = b.id `
    );
    // Verifica se a consulta retornou resultados
    if (resultado.rows.length === 0) {
      return res.status(200).json([]);
    }
    // Retorna os resultados  
    res.status(200).json(resultado.rows);

  } catch (error) {
    // Log do erro para depuração
    console.error('Erro ao listar seguimentos:', error);
    res.status(500).json({ error: 'Erro ao listar seguimentos.' });
  }
}
//#endregion
