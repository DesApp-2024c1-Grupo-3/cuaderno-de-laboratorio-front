import { getJsonFromApi } from './utils';

export async function getTodosLasCursos() {
  const apiResponse = await getJsonFromApi('/profesor/:profesorId/cursos');
  return apiResponse.data;
}

export async function getCursoPorIdProfesor(id) {
  const apiResponse = await getJsonFromApi(`profesor/${id}/cursos`);
  console.log('Respuesta de la api: ', apiResponse);
  return apiResponse.cursos;
}
