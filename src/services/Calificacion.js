import { postMultipartToApi, getJsonFromApi, putJsonToApi } from './utils';

export async function crearCalificacion(body) {
  const apiResponse = await postMultipartToApi(`calificacion/`, body);
  return apiResponse;
}

export async function getComAlumnByCalifId(idGrupo, tpId) {
  const apiResponse = await getJsonFromApi(`calificacion/${idGrupo}/${tpId}`);
  return apiResponse;
}
export async function getComAlumnIndByCalifId(idEntregaAlumno, tpId) {
  const apiResponse = await getJsonFromApi(
    `calificacionIndivdual/${idEntregaAlumno}/${tpId}`
  );
  return apiResponse.comentario;
}
export async function updateCalificacion(id, data) {
  try {
    const response = await putJsonToApi(`calificacion/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error al actualizar la calificación:', error);
    throw error;
  }
}
