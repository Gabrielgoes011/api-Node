//terminal.js - Interface de terminal para CRUD de usuários via API
//Foi desenvolvido para teste de API RESTful com Node.js e Express
//enquanto nao desenvolvo o frotend web.


//importa o redline
import readline from 'readline';
import redlineSync from 'readline-sync';

//inicia interface de leitura
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//api base              
const API_URL = 'http://localhost:3000'

//função auxiliar para transformar rl.question em Promise (para usar await)
function question(msg) {
    return new Promise(resolve => rl.question(msg, resolve))
}

//Function menu
async function menu() {

    //limpa a tela
    console.clear();

    //mostra o menu
    console.log('╔══════════════════════════════════════════════════╗')
    console.log('║   MENU PRINCIPAL - CRUD API CADASTRO DE USUÁRIOS ║')
    console.log('╚══════════════════════════════════════════════════╝')
    console.log('1 - Listar todos os usuários')
    console.log('2 - Criar um novo usuário')
    console.log('3 - Atualizar um usuário')
    console.log('4 - Deletar um usuário')
    console.log('0 - Sair')

    //retorna a opção escolhida
    return await question('Escolha uma opção: ')
}

//função que incia e verifica a opção
async function start() {
    //enquanto rodando for veradeiro o programa continua rodando
    let rodando = true

    while (rodando) {
        const opcao = await menu()

        //pega a opção do menu, para rodar a chamada correta
        switch (opcao) {
            case '1':
                console.clear()
                console.log('Listando todos os usuários...')

                // Busca os usuários na API
                const response = await fetch(API_URL + '/users')
                const users = await response.json()
                console.table(users) // Mostra em formato de tabela

                await question('Pressione ENTER para voltar ao menu...')
                break

            case '2':
                console.clear()
                console.log('--- CADASTRAR NOVO USUÁRIO ---')

                //captura os dados que vão ser digitados
                const nome = await question('Nome: ')
                const idade = await question('Idade: ')
                const email = await question('Email: ')
                const cpf = await question('CPF: ')
                //usa hideEchoBack para ocultar senha
                const senha = redlineSync.question('Senha: ', { hideEchoBack: true })
                const confirmaSenha = redlineSync.question('Confirme sua senha: ', { hideEchoBack: true })

                //monta objeto para enviar para o backend da forma que ele espera
                const novoUsuario = {
                    nome,             // Atalho do JS: se a chave e variavel tem mesmo nome, não precisa repetir
                    idade: parseInt(idade), // Converte para número inteiro
                    email,
                    cpf,
                    senha,
                    confirmaSenha
                }

                console.clear()
                console.log('Enviando dados...')

                //tenta fazer o post
                try {
                    const response = await fetch(API_URL + '/cadUsers', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(novoUsuario)
                    })

                    //captura a resposta
                    const data = await response.json()

                    //verifica se deu certo
                    if (response.ok) {
                        console.log('\n✅ Sucesso: ' + data.message)
                        await question('Pressione ENTER para voltar ao menu...')
                    } else {
                        // Mostra o erro exato que você programou no backend (ex: "CPF já cadastrado")
                        console.log('\n❌ Erro: ' + data.error)
                        await question('Pressione ENTER para voltar ao menu...')
                    }

                    //
                } catch (error) {
                    console.log('\n❌ Erro de conexão: Não foi possível conectar à API.')
                    await question('\nPressione ENTER para voltar ao menu...')
                }
                break

            case '4':
                console.clear()
                console.log('--- DELETAR USUÁRIO ---')

                //captura o id do usuário a ser deletado
                const idDeletar = await question('Digite o ID do usuário a ser deletado: ')

                console.clear()
                console.log('Deletando usuário...')

                try {
                    const response = await fetch(API_URL + '/users/delete/' + idDeletar, {
                        method: 'DELETE'
                    })

                    if (response.ok) {
                        // Requisições DELETE bem-sucedidas geralmente retornam 204 No Content (sem corpo).
                        // Então, apenas confirmamos o sucesso se a resposta for 'ok'.
                        console.log('\n✅ Sucesso: Operação de delete enviada.');
                    } else {
                        // Se deu erro, lemos a resposta como texto para exibir a mensagem da API.
                        const errorText = await response.text();
                        console.log(`\n❌ Erro ${response.status}: ${errorText}`);
                    }
                } catch (error) {
                    console.log('\n❌ Erro de conexão: Não foi possível conectar à API.');
                }
                
                await question('Pressione ENTER para voltar ao menu...');
                break; // Adiciona o break que estava faltando para não finalizar o programa.

            case '0':
                // Fecha a interface de leitura antes de sair
                rl.close()
                rodando = false
                console.log('Finalizando o programa...')
                break

            //qualquer outra opção retorna
            default:
                console.clear()
                console.log('Opção inválida/em desenvolvimento!')
                await question('Pressione ENTER para voltar ao menu...')
                break
        }
    }
}

start()