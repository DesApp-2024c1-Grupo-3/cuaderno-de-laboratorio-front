import { getJsonFromApi } from './utils';

export async function getTodosLasCursos() {
  const apiResponse = await getJsonFromApi('/profesor/:profesorId/cursos');
  return apiResponse;
}

export async function getCursoPorIdProfesor(id) {
  const apiResponse = await getJsonFromApi(`profesor/${id}/cursos`);
  return apiResponse.cursos;
}
