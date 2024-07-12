import { deleteFromApi, getJsonFromApi, postJsonToApi, putJsonToApi } from './utils';

export async function getTodosLosGrupos() {
  const apiResponse = await getJsonFromApi('grupos/');
  apiResponse.arrayGrupos;

  return apiResponse.arrayGrupos;
}

export async function getGrupoByCursoId(id) {
  const apiResponse = await getJsonFromApi(`curso/${id}/grupos`);

  return apiResponse.grupos;
}

export async function getGrupoPorId(id) {
  const apiResponse = await getJsonFromApi(`grupo/${id}`);
  return apiResponse.alumnos;
}

export async function postCrearGrupo(data, idCurso) {
  const apiResponse = await postJsonToApi(`grupos/${idCurso}`, data);
  return apiResponse;
}
export async function postEliminarGrupo(id) {
  console.log('ID GRUPO: ', id);
  const apiResponse = await deleteFromApi(`grupo/${id}`);
  console.log('Delete grupo; ', apiResponse);
  return apiResponse;
}

export async function getArchivoEntrega(id) {
  const apiResponse = await getJsonFromApi(`grupo/${id}`);
  return apiResponse.alumnos;
}

export async function updateNotaEntrega(id) {
  const apiResponse = await getJsonFromApi(`grupo/${id}`);
  return apiResponse.alumnos;
}
export async function updateGrupo(id, idGrupo, idCurso) {
  const apiResponse = await getJsonFromApi(`curso/${id}/${idCurso}/grupo/${idGrupo}`);

  return apiResponse.grupos;
}
export async function upDateGrupo(grupoId, grupoData) {
  const apiResponse = await putJsonToApi(`grupo/${grupoId}`, grupoData);

  return apiResponse;
  
}
