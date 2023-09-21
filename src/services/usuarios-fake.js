import { usuariosFijos } from '../constants/constants';

export async function getTodosLosUsuarios() {
  return Promise.resolve(usuariosFijos);
}

export async function getUsuarioPorId(id) {
  const elUsuario = usuariosFijos.find((usu) => usu.id === Number(id));
  if (!elUsuario) {
    throw new Error(`Le usuarie ${id} no existe`);
  }
  return Promise.resolve(elUsuario);
}
