import {Entity, model, property} from '@loopback/repository';

@model()
export class Car extends Entity {
  @property({
    type: 'string',
  })
  alias?: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  gallery?: string[];

  @property({
    type: 'number',
    default: 0,
  })
  likes?: number;

  @property({
    type: 'object',
  })
  specs?: object;

  @property({
    type: 'object',
  })
  exhibition?: object;

  @property({
    type: 'object',
  })
  pops?: object;

  @property({
    type: 'object',
  })
  eightMile?: object;

  @property({
    type: 'object',
  })
  donuts?: object;

  @property({
    type: 'object',
  })
  social?: object;


  constructor(data?: Partial<Car>) {
    super(data);
  }
}

export interface CarRelations {
  // describe navigational properties here
}

export type CarWithRelations = Car & CarRelations;
