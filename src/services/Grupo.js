import { getJsonFromApi } from './utils';

export async function getTodosLosGrupos() {
    const apiResponse = await getJsonFromApi('');
    return apiResponse.data;
}

export async function getGrupoPorId(id) {
    const apiResponse = await getJsonFromApi(`grupo/${id}`);
    return apiResponse.grupo;
}
