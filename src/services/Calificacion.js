import { postMultipartToApi, getJsonFromApi } from './utils';

export async function crearCalificacion(body) {
  const apiResponse = await postMultipartToApi(`calificacion/`, body);
  return apiResponse;
}

export async function getComAlumnByCalifId(idGrupo, tpId) {
  const apiResponse = await getJsonFromApi(`calificacion/${idGrupo}/${tpId}`);
  return apiResponse.coment;
}