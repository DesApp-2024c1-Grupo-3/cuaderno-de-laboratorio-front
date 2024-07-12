import { getJsonFromApi } from './utils';

export async function getTodosLosAlumnos() {
  const apiResponse = await getJsonFromApi(`alumnos/`);
  return apiResponse;
}

export async function GetIdAlumnoByDNI(dni) {
  // creada para buscar id almno con dni , si no se usa, se borra
  const apiResponse = await getJsonFromApi(`alumno/${dni}`);
  return apiResponse;
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
export async function getAlumnoById(alumnoId) {
  const apiResponse = await getJsonFromApi(`alumnoSolo/${alumnoId}`);
  return apiResponse;
}
