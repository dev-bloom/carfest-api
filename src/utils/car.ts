export type CarInfoEvents = {
  exhibition?: {
    ranking: number;
    stand: string;
  };
  pops?: {
    ranking: number;
  };
  limbo?: {
    ranking: number;
    record: number;
  };
  slalom?: {
    ranking: number;
    record: number;
  };
  eightMile?: {
    time: number;
    speed: number;
    ranking: number;
  };
  donuts?: {
    time: number;
    amount: number;
    ranking: number;
  };
};
export const emptyCarInfoEvents: CarInfoEvents = {
  exhibition: {
    ranking: 0,
    stand: '',
  },
  pops: {
    ranking: 0,
  },
  limbo: {
    ranking: 0,
    record: 0,
  },
  slalom: {
    ranking: 0,
    record: 0,
  },
  eightMile: {
    time: 0,
    speed: 0,
    ranking: 0,
  },
  donuts: {
    time: 0,
    amount: 0,
    ranking: 0,
  },
};
