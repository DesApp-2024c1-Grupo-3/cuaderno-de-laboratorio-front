import axios from 'axios';

const apiUrl = 'http://localhost:8080';

export async function getJsonFromApi(path) {
  const response = await axios.get(`${apiUrl}/${path}`);
  return response.data;
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
