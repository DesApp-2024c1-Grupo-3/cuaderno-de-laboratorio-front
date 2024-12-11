import axios from 'axios';

const apiUrl = 'http://localhost:8080';

export async function getJsonFromApi(path, token) {
  const response = await axios.get(`${apiUrl}/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function postMultipartToApi(path, data, token) {
  try {
    const response = await axios.post(`${apiUrl}/${path}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error en la solicitud POST:', error);
    throw error;
  }
}

export async function postJsonToApi(path, data, token) {
  try {
    const response = await axios.post(`${apiUrl}/${path}`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error en la solicitud POST:', error);
    throw error;
  }
}

export async function deleteFromApi(path, token) {
  try {
    const response = await axios.delete(`${apiUrl}/${path}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error en la solicitud DELETE:', error);
    throw error;
  }
}

export async function putJsonToApi(path, data, token) {
  try {
    const response = await axios.put(`${apiUrl}/${path}`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error(
      'Error en la solicitud PUT:',
      error.response || error.message
    );
    throw error;
  }
}
