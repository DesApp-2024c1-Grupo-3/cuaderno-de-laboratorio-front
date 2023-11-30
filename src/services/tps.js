import { getJsonFromApi, postJsonToApi, deleteFromApi } from './utils';

export async function getTodosLosTps() {
  const apiResponse = await getJsonFromApi('usuarios');
  return apiResponse.data;
}

export async function getTpPorId(id) {
  const apiResponse = await getJsonFromApi(`usuarios/${id}`);
  return apiResponse.data;
}

export async function getTpsByCursoId(id) {
  const apiResponse = await getJsonFromApi(`curso/${id}/tps`);
  return apiResponse.tps;
}

export async function crearTp(idCurso, profesorId, body) {
  const apiResponse = await postJsonToApi(
    `profesor/${profesorId}/curso/${idCurso}/tp`,
    body
  );
  return apiResponse;
}

export async function deleteTp(tpId) {
  try {
    const response = await deleteFromApi(`tp/${tpId}`);
    if (response.status === 200) {
      // Eliminación exitosa
      // Puedes realizar otras acciones aquí si es necesario
      console.log('Tp eliminado exitosamente');
    } else {
      console.error('Error al eliminar Tp');
      // Manejo de errores según sea necesario
    }
    return response;
  } catch (error) {
    console.error('Error en la solicitud:', error);
    // Manejo de errores según sea necesario
  }
}
