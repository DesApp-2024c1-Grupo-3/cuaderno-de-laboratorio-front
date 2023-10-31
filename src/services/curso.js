import { getJsonFromApi } from './utils';

export async function getTodosLasCursos() {
  const apiResponse = await getJsonFromApi('usuarios');
  return apiResponse.data;
}

export async function getCursoPorId(id) {
  const apiResponse = await getJsonFromApi(`usuarios/${id}`);
  return apiResponse.data;
}
