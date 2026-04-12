import express from 'express'; //importa a biblioteca express
import cors from 'cors'; // importa a biblioteca cors
import usuariosRoutes from './routes/usuarios.routes.js'; // importa as rotas de usuários
import seguimentosRoutes from './routes/seguimentos.routes.js'; // importa as rotas de segmentos
import meusFundosRoutes from './routes/meusFundos.routes.js'; // importa as rotas de meus fundos

const app = express(); //cria uma aplicação express
app.use(cors()); //habilita o cors para todas as rotas
app.use(express.json()); //habilita json no corpo da requisição para retornar dados em json


//Get na rota raiz ("/") Hello World
app.get('/', function (req, res) {
    res.json({
        "status": 200,
        "mensagem": "Bem vindos a Minha primeira API!",
        "Versão": "1.0"
    }) //responde com Json
})

app.use('/', usuariosRoutes); // Usa as rotas de usuários
app.use('/', seguimentosRoutes); // Usa as rotas de segmentos
app.use('/', meusFundosRoutes); // Usa as rotas de meus fundos

//exporta o app para ser usado em outros arquivos
export default app;
