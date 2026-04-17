import { openDb } from "../../../config/configDb.js";

//função carrega grid de operações

export async function listarOperacoes(req, res) {

    //recuperar dados da requisição
    const campos {
        mes,
        ano,
    } = req.body;

    //abrir conexão com o banco de dados
    const db = await openDb();

    //consultar os dados
    const operacoes = await db.query(`
        SELECT o.id, o.data, o.valor, o.descricao, o.tipo, c.nome AS categoria
        FROM operacoes o
        JOIN categorias c ON o.categoria_id = c.id
        WHERE MONTH(o.data) = ? AND YEAR(o.data) = ?
        ORDER BY o.data DESC
    `, [mes, ano]);

    //retornar os dados para o cliente
    res.json(operacoes);

    }
}//DEPOIS FINALIZO
//DEPOIS FINALIZO
//DEPOIS FINALIZO
//DEPOIS FINALIZO 