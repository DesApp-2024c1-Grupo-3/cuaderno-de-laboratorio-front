import { Grupos } from '../constants/Grupos';

export async function getTodosLosGrupos() {
    return Promise.resolve(Grupos);
}

export async function getGrupoPorId(id) {
    const elGrupo = Grupos.find((usu) => usu.id === Number(id));
    if (!elGrupo) {
        throw new Error(`Le usuarie ${id} no existe`);
    }
    return Promise.resolve(elGrupo);
}
