import { postJsonToApi } from './utils';

export async function crearCalificacion(body) {
  const apiResponse = await postJsonToApi(`calificacion/`, body);
  return apiResponse;
}
