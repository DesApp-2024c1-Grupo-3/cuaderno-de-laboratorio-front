import { getJsonFromApi } from './utils';

export async function getTodosLosProfesores() {
  const apiResponse = await getJsonFromApi('profesores');
  return apiResponse;
}

export async function getProfesorPorId(id) {
  const apiResponse = await getJsonFromApi(`profesor/${id}`);
  return apiResponse;
}
