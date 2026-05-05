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

//#region => função para carregar grafico dashboard
async function carregarGraficoDashboard(req, res) {
  try {
    //Recupera dados da requisição

    const campos = {
      ano: req.body.ano
    };

    //Abre a conexão com o banco de dados 
    const db = await openDb();

    //query para calcular o total de rendimentos por mês
    const detalheMensal = await db.query(`
      SELECT 
          EXTRACT(MONTH FROM "dtRendimento") mes,
          EXTRACT(YEAR FROM "dtRendimento") ano,
          SUM("valorRecebido") AS "totalRendimento"
      FROM rendimentos
      WHERE EXTRACT(YEAR FROM "dtRendimento") = $1
      GROUP BY 
          EXTRACT(YEAR FROM "dtRendimento"),
          EXTRACT(MONTH FROM "dtRendimento")
      ORDER BY ano, mes;
    `, [campos.ano]);

    const detalheAnual = await db.query(`
      SELECT 
          EXTRACT(YEAR FROM "dtRendimento") ano,
          SUM("valorRecebido") AS "totalRendimento"
      FROM rendimentos
      GROUP BY 
          EXTRACT(YEAR FROM "dtRendimento")
      ORDER BY ano;
    `);
    //retornar os dados

    return res.status(200).json({
      detalheMensal: detalheMensal.rows,
      detalheAnual: detalheAnual.rows
    });

  } catch (error) {
    //retornar um erro detalhado em caso de falha na consulta
    return res.status(500).json({ error: 'Erro ao carregar os dados do gráfico.', errorDetails: error.message });
  }
}


//#endregion
export {
  listarRendimentos,
  carregarGraficoDashboard
};



