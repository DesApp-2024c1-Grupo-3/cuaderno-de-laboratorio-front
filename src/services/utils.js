import axios from 'axios';

const apiUrl = 'http://localhost:8080';

export async function getJsonFromApi(path) {
  const response = await axios.get(`${apiUrl}/${path}`);
  return response.data;
}
export async function postMultipartToApi(path, data) {
  try {
    const response = await axios.post(`${apiUrl}/${path}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Error en la solicitud POST:', error);
    throw error; // Puedes manejar el error según tus necesidades
  }
}
export async function postJsonToApi(path, data) {
  try {
    const response = await axios.post(`${apiUrl}/${path}`, data, {
      headers: {
        'Content-Type': 'application/json',

        // Puedes agregar otros encabezados según sea necesario
      },
    });
    return response;
  } catch (error) {
    console.error('Error en la solicitud POST:', error);
    throw error; // Puedes manejar el error según tus necesidades
  }
}

export async function deleteFromApi(path) {
  try {
    const response = await axios.delete(`${apiUrl}/${path}`, {
      headers: {
        'Content-Type': 'application/json',
        // Puedes agregar otros encabezados según sea necesario
      },
    });
    return response;
  } catch (error) {
    console.error('Error en la solicitud DELETE:', error);
    throw error; // Puedes manejar el error según tus necesidades
  }
}
export async function putJsonToApi(path, data) {
  try {
    const response = await axios.put(`${apiUrl}/${path}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el grupo:', error);
    throw error;
  }
}
