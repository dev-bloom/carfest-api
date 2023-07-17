import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  Response,
  response,
  RestBindings,
} from '@loopback/rest';
import {env} from '../env';
import {Qr} from '../models';
import {CarRepository, QrRepository} from '../repositories';

class QrUpdate extends Qr {
  uid: string;
}

export class QrController {
  constructor(
    @repository(QrRepository)
    public qrRepository: QrRepository,
    @repository(CarRepository)
    public carRepository: CarRepository,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
  ) {}

  @post('/qr/batch')
  @response(200, {
    description: 'Empty QR model instances',
    content: {'application/json': {schema: getModelSchemaRef(Qr)}},
  })
  async createEmptyBatch(): Promise<Qr[]> {
    const QRBatch: Partial<Qr>[] = Array(30).fill(new Qr());
    return this.qrRepository.createAll(QRBatch);
  }

  @post('/qr')
  @response(200, {
    description: 'Qr model instance',
    content: {'application/json': {schema: getModelSchemaRef(Qr)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Qr, {
            title: 'NewQr',
            exclude: ['id'],
          }),
        },
      },
    })
    qr: Omit<Qr, 'id'>,
  ): Promise<Qr> {
    return this.qrRepository.create(qr);
  }

  @get('/qr/count')
  @response(200, {
    description: 'Qr model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Qr) where?: Where<Qr>): Promise<Count> {
    return this.qrRepository.count(where);
  }

  @get('/qr')
  @response(200, {
    description: 'Array of Qr model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Qr, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Qr) filter?: Filter<Qr>): Promise<Qr[]> {
    return this.qrRepository.find(filter);
  }

  @get('/qr/empty')
  @response(200, {
    description: 'Array of empty QR model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Qr, {includeRelations: true}),
        },
      },
    },
  })
  async findEmpty(@param.filter(Qr) filter?: Filter<Qr>): Promise<Qr[]> {
    const whereFilter = {...filter, where: {car: {eq: null}}};
    return this.qrRepository.find(whereFilter);
  }

  @patch('/qr')
  @response(200, {
    description: 'Qr PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Qr, {partial: true}),
        },
      },
    })
    qr: Qr,
    @param.where(Qr) where?: Where<Qr>,
  ): Promise<Count> {
    return this.qrRepository.updateAll(qr, where);
  }

  @get('/qr/{id}')
  @response(200, {
    description: 'Qr model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Qr, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Qr, {exclude: 'where'}) filter?: FilterExcludingWhere<Qr>,
  ): Promise<Qr> {
    return this.qrRepository.findById(id, filter);
  }

  @get('/qr/car/{id}')
  @response(200, {
    description: 'Qr model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Qr, {includeRelations: true}),
      },
    },
  })
  async findByCar(
    @param.path.string('id') id: string,
    @param.filter(Qr, {exclude: 'where'}) filter?: FilterExcludingWhere<Qr>,
  ): Promise<Qr> {
    const qr = await this.qrRepository.findOne({
      ...filter,
      where: {car: id},
    });
    if (!qr) {
      throw new Error('QR not found');
    }
    return qr;
  }

  @get('/qr/scan/{id}')
  @response(200, {
    description: 'Qr model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Qr, {includeRelations: true}),
      },
    },
  })
  async scan(
    @param.path.string('id') id: string,
    @param.filter(Qr, {exclude: 'where'}) filter?: FilterExcludingWhere<Qr>,
  ): Promise<void> {
    const qr = await this.qrRepository.findById(id, filter);
    if (!qr) {
      throw new Error('QR not found');
    }
    if (qr.car) {
      this.res.redirect(`${env.APP_URL}/car/${qr.car}`);
    } else {
      this.res.redirect(`${env.APP_URL}/profile?qr=${qr.id}`);
    }
    return;
  }

  @patch('/qr/{id}')
  @response(204, {
    description: 'Qr PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() req: Partial<QrUpdate>,
  ): Promise<Qr> {
    const {uid, ...qr} = req;
    if (!qr.car) {
      throw new Error('Car ID is required');
    }
    const [dbQR, car] = await Promise.all([
      this.qrRepository.findById(id),
      this.carRepository.findById(qr.car),
    ]);
    if (dbQR.car === qr.car) {
      throw new Error('QR Is already assigned to this car');
    }
    if (dbQR.car) {
      const QRCar = await this.carRepository.findById(dbQR.car);
      if (QRCar.uid !== uid) {
        throw new Error('QR Is assigned to another user');
      }
    }
    if (!car) {
      throw new Error('Car not found');
    }
    if (car.uid !== uid) {
      throw new Error('Car UID does not match');
    }
    try {
      await this.qrRepository.updateById(id, qr);
      return this.qrRepository.findById(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  @put('/qr/{id}')
  @response(204, {
    description: 'Qr PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() qr: Qr,
  ): Promise<void> {
    await this.qrRepository.replaceById(id, qr);
  }

  @del('/qr/{id}')
  @response(204, {
    description: 'Qr DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.qrRepository.deleteById(id);
  }
}
