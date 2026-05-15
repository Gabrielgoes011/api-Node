import { 
    listarFundosRepository, //lista no grid
    buscarFundosRepository, //verifica se o ticker já existe
    cadastrarFundosRepository //cadastra os fundos
} from "../../repositories/cadastros/meuFundos.repositories.js";

//#region => Service para listar os fundos cadastrados
 async function listarFundosService() {

    //Chama a função do repositório para listar os fundos
    const listarFundos = await listarFundosRepository();

    //retorna lista de fundos
    return listarFundos;

}
//#endregion

//#region => Service para cadastrar fundos
async function cadastrarFundosService(dados) {

    //verifica se o campo ticker está vazio
    if (!dados.ticker) {
        throw new Error(
            'O campo ticker nao pode ser vazio');
    }

    //chama a função do repositório para verificar se o ticker já existe
    const existeTicker = await buscarFundosRepository(dados.ticker);

    //se o ticker já existir, lança um erro
    if (existeTicker) {
        throw new Error(
            'O ticker informado já está cadastrado');
    }   

    //Chama a função do repositório para cadastrar os fundos
    const cadastrarFundos = await cadastrarFundosRepository(dados);

    //retorna o resultado
    return cadastrarFundos; 
}
//#endregion

export {
    listarFundosService,
    cadastrarFundosService
}