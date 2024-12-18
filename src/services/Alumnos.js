import { getJsonFromApi } from './utils';

export async function getTodosLosAlumnos() {
  const apiResponse = await getJsonFromApi(`alumnos/`);
  return apiResponse; // este no lo uso, poner el metodo que estaba antes
}

export async function getAlumnosByCursoId(cursoId) {
  const apiResponse = await getJsonFromApi(`curso/${cursoId}/alumnos`);
  return apiResponse.alumnos;
}
//------------

export async function getCursosByAlumnoIdWithAgreggate(alumnoId) {
  const apiResponse = await getJsonFromApi(`alumno/${alumnoId}/cursos`);
  return apiResponse.cursos;
}
//--------
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

export async function getTodosLosAlumnosJson() {
  //metodo para el login provisonal
  const apiResponse = await getJsonFromApi(`alumnosJson/`);
  return apiResponse;
}
