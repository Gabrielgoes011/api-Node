
import  {openDb}  from './configDb.js';    //importa a função openDb do arquivo configDb.js
import { contarUsuarios, listarUsuarios } from './controler/usuarios/get.js'; //importa a função listarUsuarios do arquivo Get.js
import { cadastrarUser } from './controler/usuarios/post.js'; //importa a função cadastrarUser do arquivo Post.js
import { deleteUser } from './controler/usuarios/delete.js'; //importa a função deleteUser do arquivo Delete.js
import express from 'express'; //importa a biblioteca express
import cors from 'cors'; // importa a biblioteca cors
const app = express(); //cria uma aplicação express
app.use(cors()); //habilita o cors para todas as rotas
app.use(express.json()); //habilita json no corpo da requisição para retornar dados em json

/*---------------------------------------------------------------------------------------------------*/

//Get na rota raiz ("/") Hello World
app.get('/', function(req, res) {
    res.json({
        "status": 200,
        "mensagem": "Bem vindos a Minha primeira Api!",
        "Versão": "1.0"
    }) //responde com Json
})

/*---------------------------------------------------------------------------------------------------*/

//get lista todos os usuarios na rota /users
app.get('/users', async function(req, res) {
    const users = await listarUsuarios();
    res.json(users); //responde com os usuários em formato JSON
    console.log(users); //imprime os usuários no console (teste)
});

/*---------------------------------------------------------------------------------------------------*/

//get conta o total de usuarios na rota /users/dash/count
app.get('/users/dash/count', async function(req, res) {
    const resultado = await contarUsuarios()
    console.log(resultado); //imprime os usuários no console (teste)
    res.json(resultado); //responde com os usuários em formato JSON
});

/*---------------------------------------------------------------------------------------------------*/

//get busca um usuario pelo id na rota /user/:id
app.get('/users/:id', async function(req, res) {
    const id = req.params.id; //pega o id da requisição
    const db = await openDb(); //abre a conexão com o banco de dados
    const users = await db.all(
        `SELECT id, nome, idade, email
         FROM TabUser
         WHERE id = ${id} `
        ); //busca os usuarios
    //se não econtrar o usuário
    if (users.length === 0) {
        return res.status(404).send('Usuário não encontrado !');
    }
    if (id < 1) {
        return res.status(400).send('O Id nao foi informado!');
    }
    res.json(users); //responde com os usuários em formato JSON
    //console.log(users); //imprime os usuários no console (teste)
});

/*---------------------------------------------------------------------------------------------------*/

//post insere um novo usuario na rota /users
app.post('/cadUsers', cadastrarUser); //chama a função cadastrarUser

/*---------------------------------------------------------------------------------------------------*/

//login de usuario na rota /login
app.post('/login', async function(req, res) {
    const { email, senha } = req.body; //pega o email e senha do corpo da requisição
    const db = await openDb(); //abre a conexão com o banco de dados
    //verifica se o email e senha foram fornecidos
    if (!email || !senha) {
        return res.status(400).send('Email e senha são obrigatórios !');
    }
    //busca o usuário pelo email
    const user = await db.get(`
        SELECT id, nome, email
        FROM TabUser
        WHERE email = ? ` ,
        [email]
    );
    //se o usuário não for encontrado
    if (!user) {
        return res.status(404).send('Usuário não encontrado !');
    }
    //busca a senha do usuário na tabela TabUserCred
    const userCred = await db.get(`
        SELECT b.password
        FROM TabUser a INNER JOIN TabUserCred b 
        ON b.idUser = a.id
        WHERE a.email =  ? ` ,
        [email]
    );
    //verifica se a senha está correta
    if (userCred.password !== senha) {
        console.log(senha, userCred.password)
        return res.status(401).send('Senha incorreta !');
    }
    //se tudo estiver correto, responde com os dados do usuário
    res.status(200).json({message: 'Login realizado com sucesso !', user: user
    });
});


/*---------------------------------------------------------------------------------------------------*/

//put atualiza um usuario na rota /users/update/:id
app.put('/users/update/:id', async function(req, res) {
    const id = req.params.id; //pega o id da requisição
    const user = req.body; //pega o corpo da requisição
    const db = await openDb(); //abre a conexão com o banco de dados
    if (!user.nome === undefined || !user.idade === undefined || !user.email === undefined) {
        return res.status(400).send('Insira todos os campos obrigatórios !');
    }
    if (!user.nome.trim().includes(' ')) {
        return res.status(400).send('Insira o nome e sobrenome!');
    }
    if (!user.email.includes('@') || !user.email.includes('.')) {
        return res.status(400).send('Email inválido !');
    } 
    if (user.email) {
        const existeEmail = await db.get(`
            SELECT id
            FROM TabUser
            WHERE email = '${user.email}' `
        ); 
        if (existeEmail && existeEmail.id != id)
        return res.status(400).send('Email já cadastrado !');
    }
    //try atualiza o usuário no banco de dados
    try { const sql = `
        UPDATE TabUser
        SET nome = ? ,
            idade = ? ,
            email = ? 
        WHERE id = ? 
    `;
    //console.log(user.nome, user.idade, user.email, id)
    await db.run(sql, [user.nome, user.idade, user.email, id]);

         res.status(200).json({ message: 'Usuário atualizado com sucesso!' }); // Responde com JSON
    } catch (error) {
        console.error('Erro ao atualizar o usuário:', error);
        res.status(500).json({ error: 'Erro ao atualizar o usuário.' }); // Responde com JSON
    }
}); 

/*---------------------------------------------------------------------------------------------------*/

//delete deleta um usuario na rota /users/delete/:id
app.delete('/users/delete/:id', deleteUser) 



//exporta o app para ser usado em outros arquivos
export default app;
