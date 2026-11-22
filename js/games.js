/** Реестр мини-игр. Игры подключаются на следующих этапах. */
export const gameRegistry=new Map(); export function registerGame(id,game){gameRegistry.set(id,game)}
