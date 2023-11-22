import { getJsonFromApi } from './utils';

export async function getTodosLosAlumnos() {
  const apiResponse = await getJsonFromApi('');
  return apiResponse.data;
}

export async function getAlumnoPorId(id) {
  const apiResponse = await getJsonFromApi(`alumno/${id}`);
  return apiResponse.cursos;
}
