import axios from 'axios';

const apiUrl = 'http://localhost:8080';

export async function getJsonFromApi(path) {
  const response = await axios.get(`${apiUrl}/${path}`);
  return response.data;
}
