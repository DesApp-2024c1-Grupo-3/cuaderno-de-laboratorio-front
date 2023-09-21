import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

export async function getJsonFromApi(path) {
  const response = await axios.get(`${apiUrl}/${path}`);
  return response.data;
}
