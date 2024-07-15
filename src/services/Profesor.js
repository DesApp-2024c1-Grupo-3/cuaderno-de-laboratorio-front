import { getJsonFromApi } from './utils';

export async function getTodosLosProfesores() {
  const apiResponse = await getJsonFromApi('profesores/');
  return apiResponse; // Usar el metodo del otro commit. este fue modificado al pedo
}

export async function getProfesorPorId(id) {
  const apiResponse = await getJsonFromApi(`profesor/${id}`);
  return apiResponse;
}

export async function getTodosLosProfesoresJson() {
  //metodo para el login provisonal
  const apiResponse = await getJsonFromApi('profesoresJson/');
  return apiResponse;
}
