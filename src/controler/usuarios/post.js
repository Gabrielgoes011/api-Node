import { openDb } from '../../configDb.js';


//Função para cadastar usuarios
export async function cadastrarUser(req, res){
    const user = req.body; //pega o corpo da requisição
    const db = await openDb(); //abre a conexão com o banco de dados

    //verifica se os campos obrigatorios estão presentes
    if (!user.nome || !user.idade || !user.email || !user.cpf) {
        return res.status(400).json({error:'Insira todoso os campos obrigatorios !'});
    }   

     //verifica se tem sobrenome
    if (!user.nome.trim().includes(' ')) {
        return res.status(400).json({error:'Insira o nome e sobrenome!'});
    }

    //verifica se o cpf tem 11 digitos
    if (user.cpf.length != 11) {
        return res.status(400).json({error: 'CPF deve conter 11 digitos !'});
    }

    //verifca email valido
    if (!user.email.includes('@') || !user.email.includes('.')) {
        return res.status(400).json({error:'Email inválido !'});
    }
    
    //verifica se email ja tem cadastro
    const existeEmail = await db.get(`
            SELECT id 
            FROM TabUser 
            WHERE email = ? ` , [user.email]
        ); 
        
        if (existeEmail){
            return res.status(400).json({error:'Email ja cadastrado!'}); //retorna e sai
        }

    const existeCpf = await db.get(`
            SELECT id
            FROM TabUser
            WHERE cpf = ? `,[user.cpf]
        );
        if (existeCpf) {
        return res.status(400).json({error:'CPF já cadastrado !'}); //retorna e sai
    }

    //Verificação de senha

    if (user.senha !== user.confirmaSenha){
        return res.status(400).json({error:'As senhas não coincidem !'}); 
    }
    if (user.senha.length < 8) {
        return res.status(400).json({error:'A senha deve ter no mínimo 8 caracteres !'});
    }
    if (!/[A-Z]/.test(user.senha)) {
        return res.status(400).json({error:'A senha deve conter pelo menos uma letra maiúscula !'});
    }

    
    //pasou na verificação entra no Try
    try {
        //recupera senha da req
        const senhaPura = user.senha;

        //inicia transação
        await db.run('BEGIN TRANSACTION')

        const insertUser = await db.run(`
            INSERT INTO TabUser (nome, idade, email, cpf)
            VALUES (?, ?, ?, ?)` ,
            [user.nome, user.idade, user.email, user.cpf] 
        )
        //recupera o id que foi inserido
        const newUserId = insertUser.lastID; 

        const insertCred = await db.run(`
            INSERT INTO TabUserCred (password, idUser)
            VALUES (?, ?)`,
            [senhaPura, newUserId]
        );

        await db.run('COMMIT'); //confirma a transação
        return res.status(201).json({ message: 'Usuário cadastrado com sucesso! '})
    } 

    catch (error) {
        //se qualquer await falhar
        await db.run('ROLLBACK'); //desfaz a transação
        return res.status(500).json({ error: 'Erro ao inserir o usuário.'}) 
    }

    finally { //finally usando para executar um codigo mesmo após o return do try e catch
        db.close(); //fecha a conexão com o banco de dados
    }
}


