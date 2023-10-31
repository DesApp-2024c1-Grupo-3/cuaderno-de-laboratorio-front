import { getJsonFromApi } from './utils';

export async function getTodosLosTps() {
  const apiResponse = await getJsonFromApi('usuarios');
  return apiResponse.data;
}

export async function getTpPorId(id) {
  const apiResponse = await getJsonFromApi(`usuarios/${id}`);
  return apiResponse.data;
}
