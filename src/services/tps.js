import { getJsonFromApi, postJsonToApi } from './utils';

export async function getTodosLosTps() {
  const apiResponse = await getJsonFromApi('usuarios');
  return apiResponse.data;
}

export async function getTpPorId(id) {
  const apiResponse = await getJsonFromApi(`usuarios/${id}`);
  return apiResponse.data;
}

export async function getTpsByCursoId(id) {
  const apiResponse = await getJsonFromApi(`curso/${id}/tps`);
  return apiResponse.tps;
}

export async function crearTp(idCurso, profesorId, body) {
  const apiResponse = await postJsonToApi(
    `profesor/${profesorId}/curso/${idCurso}/tp`,
    body
  );
  return apiResponse;
}
