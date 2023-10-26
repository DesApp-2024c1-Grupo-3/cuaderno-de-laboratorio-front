import { getJsonFromApi } from './utils';

export async function getTodosLasComisiones() {
  const apiResponse = await getJsonFromApi('usuarios');
  return apiResponse.data;
}

export async function getComisionPorId(id) {
  const apiResponse = await getJsonFromApi(`usuarios/${id}`);
  return apiResponse.data;
}
