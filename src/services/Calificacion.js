import {
  postMultipartToApi,
  getJsonFromApi,
  putJsonToApi,
  deleteFromApi,
} from './utils';

export async function crearCalificacion(body) {
  const apiResponse = await postMultipartToApi(`calificacion/`, body);
  return apiResponse;
}

export async function getComAlumnByCalifId(idGrupo, tpId) {
  const apiResponse = await getJsonFromApi(`calificacion/${idGrupo}/${tpId}`);
  return apiResponse.coment;
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
export async function postEliminarCalificacion(id) {
  console.log('ID Calificacion: ', id);
  const apiResponse = await deleteFromApi(`calificacion/${id}`);
  console.log('Delete Calificacion; ', apiResponse);
  return apiResponse;
}
