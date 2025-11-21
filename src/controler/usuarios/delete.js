import { openDb } from "../../configDb.js";
import { buscaUserId } from "./get.js";

//exporta a função deleteUser
export async function deleteUser(req, res) {
    const idUser = req.params.id; //pega o id da requisição
    const db = await openDb(); //abre a conexão com o banco de dados

    try {
        // Primeiro, usamos a buscaUserId para verificar se o usuário existe
        const existeUser = await buscaUserId(db, idUser);

        //verifica se o usuário existe
        if (!existeUser) { //se não existir (retornou undefined), retorna erro 404
            return res.status(404).json({ error: 'Usuário não encontrado !' });
        }

        //inicia transação
        await db.run('BEGIN')

        //deleta credenciais e usuario
        const delCred = await db.run(`
        DELETE 
        FROM TabUserCred
        WHERE idUser = ? `, [idUser]
        );
        const delUser = await db.run(`
        DELETE 
        FROM TabUser
        WHERE id = ? `, [idUser]
        );
        //confirma a transação
        await db.run('COMMIT')
        return res.json({
            statusCode: 'Sucesso (200)',
            usuario: `${existeUser.nome}`,
            message: 'O usuario foi deletado com sucesso !'
        });

    } catch (error) {
        await db.run('ROLLBACK'); //desfaz a transação
        console.error('Erro ao deletar o usuário:', error);
        return res.status(500).json({ error: 'Erro ao deletar o usuário.' });

    } finally {
        db.close(); //fecha a conexão com o banco de dados
    }
}
