import { Tps } from '../constants/tps';

export async function getTps() {
  return Promise.resolve(Tps);
}

export async function getComisionesById(id) {
  const Tp = Tps.find((com) => com.id === Number(id));
  if (!Tp) {
    throw new Error(`El TP ${id} no existe`);
  }
  return Promise.resolve(Tp);
}
