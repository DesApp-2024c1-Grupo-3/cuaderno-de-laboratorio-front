import { getJsonFromApi } from './utils';

export async function getTodosLosGrupos() {
    const apiResponse = await getJsonFromApi('grupos/');
    console.log(apiResponse.arrayGrupos)


    return apiResponse.arrayGrupos;
}

export async function getGrupoPorId(id) {
    const apiResponse = await getJsonFromApi(`grupo/${id}`);
    return apiResponse.grupo;
}

export async function postCrearGrupo(data) {
    const apiResponse = await getJsonFromApi(`grupo/${data}`);
    return apiResponse.grupo;
}

