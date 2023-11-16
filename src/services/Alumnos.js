import { AlumnosFijos } from '../constants/Alumnos';

export async function getTodosLosAlumnos() {
  return Promise.resolve(AlumnosFijos);
}

export async function getUsuarioPorId(id) {
  const elUsuario = AlumnosFijos.find((usu) => usu.id === Number(id));
  if (!elUsuario) {
    throw new Error(`Le usuarie ${id} no existe`);
  }
  return Promise.resolve(elUsuario);
}
