import { 
    listarFundosRepository
} from "../../repositories/cadastros/meuFundos.repositories";


//Service para listar os fundos cadastrados
export async function listarFundosService(req, res) {

    //Chama a função do repositório para listar os fundos
    const listarFundos = await listarFundosRepository();

    //retorna o resultado
    return listarFundos;

}