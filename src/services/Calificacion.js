import { postMultipartToApi, getJsonFromApi } from './utils';

export async function crearCalificacion(body) {
  const apiResponse = await postMultipartToApi(`calificacion/`, body);
  return apiResponse;
}

export async function getCalificacionDetails(tpId) {
  console.log(tpId)

  const response = await getJsonFromApi(`/calificacion/${tpId}/${grupoId}`);
  console.log(tpId,grupoId)
  return response.calificacion;
};