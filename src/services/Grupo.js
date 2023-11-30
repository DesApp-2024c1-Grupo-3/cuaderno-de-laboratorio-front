import { getJsonFromApi, postJsonToApi } from './utils';

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

    console.log(data)

    const apiResponse = await postJsonToApi(
        `grupo/${data}`);
    return apiResponse;

}

