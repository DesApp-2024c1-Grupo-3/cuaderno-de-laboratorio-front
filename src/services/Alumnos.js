import { getJsonFromApi } from './utils';

export async function getTodosLosAlumnos(idCurso) {
  const apiResponse = await getJsonFromApi(`curso/${idCurso}/alumnos`);
  return apiResponse.alumnos;
}

export async function getAlumnoPorId(id) {
  const apiResponse = await getJsonFromApi(`alumno/${id}`);
  return apiResponse.cursos;
}

export async function getAlumnosByCursoId(cursoId) {
  const apiResponse = await getJsonFromApi(`curso/${cursoId}/alumnos`);
  return apiResponse.alumnos;
}

export async function getCursosByAlumnoId(alumnoId) {
  const apiResponse = await getJsonFromApi(`alumno/${alumnoId}`);
  return apiResponse.cursos;
}
export async function getTpsDelCursosByAlumnoId(alumnoId) {
  const apiResponse = await getJsonFromApi(`alumno/${alumnoId}`);
  return apiResponse.Tps;
}
