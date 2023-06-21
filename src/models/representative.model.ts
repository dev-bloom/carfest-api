import {Model, model, property} from '@loopback/repository';

@model()
export class Representative extends Model {
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
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'number',
    required: true,
  })
  idNumber: number;

  @property({
    type: 'string',
    required: true,
  })
  idType: string;

  @property({
    type: 'string',
    required: true,
  })
  role: string;


  constructor(data?: Partial<Representative>) {
    super(data);
  }
}

export interface RepresentativeRelations {
  // describe navigational properties here
}

export type RepresentativeWithRelations = Representative & RepresentativeRelations;
