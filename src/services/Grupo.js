import { deleteFromApi, getJsonFromApi, postJsonToApi } from './utils';

export async function getTodosLosGrupos() {
    const apiResponse = await getJsonFromApi('grupos/');
    console.log(apiResponse.arrayGrupos)


    return apiResponse.arrayGrupos;
}

export async function getGrupoByCursoId(id) {
    const apiResponse = await getJsonFromApi(`curso/${id}/grupos`);
    return apiResponse.grupos;
}

export async function getGrupoPorId(id) {
    const apiResponse = await getJsonFromApi(`grupo/${id}`);
    return apiResponse.grupo;
}

export async function postCrearGrupo(data, idCurso) {

    const apiResponse = await postJsonToApi(`grupos/${idCurso}`, data);
    console.log('api', apiResponse.data)
    return apiResponse;

}
export async function postEliminarGrupo(id) {

    console.log(id, 'deleteApi')
    const apiResponse = await deleteFromApi(`grupo${id}`);
    return apiResponse;

}

