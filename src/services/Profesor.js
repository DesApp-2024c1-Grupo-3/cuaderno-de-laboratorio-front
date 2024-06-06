import { getJsonFromApi } from './utils';

export async function getTodosLosProfesores() {
  const apiResponse = await getJsonFromApi('profesores');
  return apiResponse.data;
}

export async function getProfesorPorId(id) {
  const apiResponse = await getJsonFromApi(`profesor/${id}`);
  return apiResponse;
}
