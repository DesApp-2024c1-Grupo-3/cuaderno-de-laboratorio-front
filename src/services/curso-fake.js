import { Curso } from '../constants/curso';

export async function getCurso() {
  return Promise.resolve(Curso);
}

export async function getCursoById(id) {
  const Curso = Curso.find((cur) => cur.id === Number(id));
  if (!Curso) {
    throw new Error(`El curso ${id} no existe`);
  }
  return Promise.resolve(Curso);
}
