import { getJsonFromApi } from './utils';

export async function getTodosLosUsuarios() {
  const apiResponse = await getJsonFromApi('usuarios');
  return apiResponse.data;
}

export async function getUsuarioPorId(id) {
  const apiResponse = await getJsonFromApi(`usuarios/${id}`);
  return apiResponse.data;
}
