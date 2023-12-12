import { getJsonFromApi, postJsonToApi, deleteFromApi } from './utils';

export async function getTodosLosTps() {
  const apiResponse = await getJsonFromApi('usuarios');
  return apiResponse.data;
}
/*
export async function getTpPorId(id) {
  const apiResponse = await getJsonFromApi(`usuarios/${id}`);
  return apiResponse.data;
}*/

export async function getTpPorId(idCurso, tpId) {
  try {
    const tps = await getTpsByCursoId(idCurso);
    const tpSeleccionado = tps.find((tp) => tp._id === tpId);
    return tpSeleccionado;
  } catch (error) {
    console.error('Error en la solicitud:', error);
    // Manejo de errores según sea necesario
  }
}

export async function getCursoPorId(idCurso) {
  try {
    const apiResponse = await getJsonFromApi('cursos');

    // Verificar si la respuesta es un objeto con la propiedad arrayCursos
    if (
      apiResponse &&
      apiResponse.arrayCursos &&
      Array.isArray(apiResponse.arrayCursos)
    ) {
      // Buscar el curso por su ID
      const cursoSeleccionado = apiResponse.arrayCursos.find(
        (curso) => curso._id === idCurso
      );

      // Devolver el curso encontrado
      return cursoSeleccionado;
    } else {
      console.error('La respuesta no es un objeto válido:', apiResponse);
      // Puedes manejar este caso según tus necesidades
      return null;
    }
  } catch (error) {
    // Manejo de errores según sea necesario
    console.error('Error al obtener el curso por ID:', error);
    throw error;
  }
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
