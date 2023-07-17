import {Entity, model, property} from '@loopback/repository';

@model()
export class Qr extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    default: null,
  })
  car: string | null;

  constructor(data?: Partial<Qr>) {
    super(data);
  }
}

export interface QrRelations {
  // describe navigational properties here
}

export type QrWithRelations = Qr & QrRelations;
