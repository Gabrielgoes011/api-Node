import { openDb } from "../../config/configDb.js";

//#region Função para listar todos os rendimentos 
async function listarRendimentos(req, res) {

  try {
    //Recupera dados da requsição
    const campos = {
      mes: req.body.mes,
      ano: req.body.ano
    };


    //Abre a conexão com o banco de dados
    const db = await openDb();

    //Construir a query dinamicamente
    let query = `
        SELECT 
          a.id, a."dtRendimento", b.ticker, 
          c."nomeSeguimento", a."valorRecebido"
        FROM rendimentos a inner join ativos b
        on a."idAtivo" = b.id 
        inner join seguimentos c
        on c.id = b."idSeguimento" 
        WHERE 
          EXTRACT(YEAR FROM a."dtRendimento") = $1
          
    `;
    let params = [campos.ano];

    //Se o mês foi informado, adiciona o filtro
    if (campos.mes !== 'Todos') {
      query += ` AND EXTRACT(MONTH FROM a."dtRendimento") = $2 `;
      params.push(campos.mes);
    }

    //Adiciona order by
    query += ` ORDER BY a."dtRendimento" DESC`;

    //Executa a query
    const rendimentos = await db.query(query, params);

    //verificar se a consulta retornou resultados
    if (rendimentos.rows.length === 0) {
      return res.status(200).json([]);
    }

    //retornar os dados
    return res.status(200).json(rendimentos.rows);

  } catch (error) {

    //retornar um erro detalhado em caso de falha na consulta
    return res.status(500).json({ error: 'Erro ao listar os rendimentos.', errorDetails: error.message });
  }
}
//#endregion


export { listarRendimentos };
