import { openDb } from "../../configDb.js";
import { buscaUserId } from "./get.js";

//exporta a função deleteUser
export async function deleteUser (req, res) {
    const idUser = req.params.id; //pega o id da requisição
    const existeUser = await buscaUserId(idUser); //vai na função verificar se o id existe no banco
    
    //verifica se o usuário existe
    if (!existeUser) {
        return res.status(404).json({error: 'Usuário não encontrado !'});
    }
    
    const db = await openDb(); //abre a conexão com o banco de dados
    try { 
        //inicia transação
        await db.run('BEGIN TRANSACTION')

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
     await db.run('COMMIT TRANSACTION')
     return  res.json({ statusCode: 'Sucesso (200)',
                        usuario: `${existeUser.nome}` ,
                        message: 'O usuario foi deletado com sucesso !'});

    } catch (error) {
        await db.run('ROLLBACK'); //desfaz a transação
        console.error('Erro ao deletar o usuário:', error);
        return res.status(500).json({ error: 'Erro ao deletar o usuário.' });

    } finally {
        db.close(); //fecha a conexão com o banco de dados
    }
}
