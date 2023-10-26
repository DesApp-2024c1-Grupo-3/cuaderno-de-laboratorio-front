import { Comisiones } from '../constants/comisiones';

export async function getComisiones() {
  return Promise.resolve(Comisiones);
}

export async function getComisionesById(id) {
  const Commision = Comisiones.find((com) => com.id === Number(id));
  if (!Commision) {
    throw new Error(`La comision ${id} no existe`);
  }
  return Promise.resolve(Commision);
}
