import { getJsonFromApi } from './utils';

export async function getEntregaDetails() {
  const apiResponse = await getJsonFromApi('/profesor/:profesorId/cursos');
  return apiResponse.data;
}

export async function updateNotaEntrega(id) {
  const apiResponse = await getJsonFromApi(`profesor/${id}/cursos`);
  return apiResponse.cursos;
}
