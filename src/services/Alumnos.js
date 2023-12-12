import { getJsonFromApi } from './utils';

export async function getTodosLosAlumnos(idCurso) {
  const apiResponse = await getJsonFromApi(`curso/${idCurso}/alumnos`);


  return apiResponse.alumnos;
}

export async function getAlumnoPorId(id) {
  const apiResponse = await getJsonFromApi(`alumno/${id}`);
  return apiResponse.cursos;
}
