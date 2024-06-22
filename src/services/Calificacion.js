import { postMultipartToApi } from './utils';

export async function crearCalificacion(body) {
  const apiResponse = await postMultipartToApi(`calificacion/`, body);
  return apiResponse;
}
