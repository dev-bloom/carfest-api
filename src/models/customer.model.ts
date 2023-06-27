import {Entity, model, property} from '@loopback/repository';

@model()
export class Customer extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  names: string;

  @property({
    type: 'string',
    required: true,
  })
  lastNames: string;

  @property({
    type: 'number',
    required: true,
  })
  idNumber: number;

  @property({
    type: 'string',
    required: true,
  })
  vehicleType: string;

  @property({
    type: 'string',
    required: true,
  })
  plate: string;

  @property({
    type: 'string',
  })
  dreamCar?: string;

  @property({
    type: 'string',
  })
  dreamBike?: string;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;


  constructor(data?: Partial<Customer>) {
    super(data);
  }
}

export interface CustomerRelations {
  // describe navigational properties here
}

export type CustomerWithRelations = Customer & CustomerRelations;
