import { getJsonFromApi } from './utils';

export async function getTodosLosGrupos() {
    const apiResponse = await getJsonFromApi('grupos');

    return apiResponse.grupo;
}

export async function getGrupoPorId(id) {
    const apiResponse = await getJsonFromApi(`grupo/${id}`);
    return apiResponse.grupo;
}

export async function postCrearGrupo(data) {
    const apiResponse = await getJsonFromApi(`grupo/${data}`);
    return apiResponse.grupo;
}

