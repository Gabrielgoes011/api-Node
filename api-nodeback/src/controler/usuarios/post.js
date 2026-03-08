import { openDb } from '../../configDb.js';


//#region Função para cadastar usuarios Cadastrar Usuario
export async function cadastrarUser(req, res) {
    const user = req.body; //pega o corpo da requisição
    const db = await openDb(); //abre a conexão com o banco de dados

    //verifica se os campos obrigatorios estão presentes
    if (!user.nome || !user.idade || !user.email || !user.cpf) {
        return res.status(400).json({ error: 'Insira todoso os campos obrigatorios !' });
    }

    //verifica se tem sobrenome
    if (!user.nome.trim().includes(' ')) {
        return res.status(400).json({ error: 'Insira o nome e sobrenome!' });
    }

    //verifica se o cpf tem 11 digitos
    if (user.cpf.length != 11) {
        return res.status(400).json({ error: 'CPF deve conter 11 digitos !' });
    }

    //verifca email valido
    if (!user.email.includes('@') || !user.email.includes('.')) {
        return res.status(400).json({ error: 'Email inválido !' });
    }

    //verifica se email ja tem cadastro
    const existeEmail = await db.query(`
            SELECT id 
            FROM dbo."tabUser"
            WHERE email = $1 ` , [user.email]
    );

    if (existeEmail.rows.length > 0) {
        return res.status(400).json({ error: 'Email ja cadastrado!' }); //retorna e sai
    }

    const existeCpf = await db.query(`
            SELECT id
            FROM dbo."tabUser"
            WHERE cpf = $1 `, [user.cpf]
    );
    if (existeCpf.rows.length > 0) {
        return res.status(400).json({ error: 'CPF já cadastrado !' }); //retorna e sai
    }

    //Verificação de senha

    if (user.senha !== user.confirmaSenha) {
        return res.status(400).json({ error: 'As senhas não coincidem !' });
    }
    if (user.senha.length < 8) {
        return res.status(400).json({ error: 'A senha deve ter no mínimo 8 caracteres !' });
    }
    if (!/[A-Z]/.test(user.senha)) {
        return res.status(400).json({ error: 'A senha deve conter pelo menos uma letra maiúscula !' });
    }

    //pasou na verificação entra no Try
    try {
        //recupera senha da req
        const senhaPura = user.senha;

        //inicia transação
        await db.query('BEGIN TRANSACTION')

        const insertUser = await db.query(`
            INSERT INTO dbo."tabUser" (nome, idade, email, cpf)
            VALUES ($1, $2, LOWER($3), $4)
            RETURNING id` ,
            [user.nome, user.idade, user.email, user.cpf]
        )
        //recupera o id que foi inserido
        const newUserId = insertUser.rows[0].id;

        const insertCred = await db.query(`
            INSERT INTO dbo."tabUserCred" (password, idUser)
            VALUES ($1, $2)`,
            [senhaPura, newUserId]
        );

        await db.query('COMMIT'); //confirma a transação
        return res.status(201).json({ message: 'Usuário cadastrado com sucesso! ' })
    }

    catch (error) {
        //se qualquer await falhar
        await db.query('ROLLBACK'); //desfaz a transação
        console.error('Erro ao inserir o usuário:', error);
        return res.status(500).json({ error: 'Erro ao inserir o usuário.' })

    }
}

//#endregion
