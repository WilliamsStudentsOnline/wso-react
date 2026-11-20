const EMBER_HEAT = 0.65;
const BASE_HEAT = 0.85;

export const fireHeat = (playing: boolean, level: number) =>
  playing ? BASE_HEAT + (1 - BASE_HEAT) * level : EMBER_HEAT;
