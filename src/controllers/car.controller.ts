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
  response,
} from '@loopback/rest';
import {Car} from '../models';
import {CarRepository} from '../repositories';
import {CarInfoEvents, emptyCarInfoEvents} from '../utils/car';
import {uploadBase64ToFirebase} from '../utils/file';

export class CarController {
  constructor(
    @repository(CarRepository)
    public carRepository: CarRepository,
  ) {}

  @post('/cars')
  @response(200, {
    description: 'Car model instance',
    content: {'application/json': {schema: getModelSchemaRef(Car)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Car, {
            title: 'NewCar',
            exclude: ['id'],
          }),
        },
      },
    })
    car: Omit<Car, 'id'>,
  ): Promise<Car> {
    const {events} = car;
    const parsedEvents: CarInfoEvents = (events ?? []).reduce(
      (prevEvents, currentEvent) => ({
        ...prevEvents,
        [currentEvent]: emptyCarInfoEvents[currentEvent],
      }),
      {},
    );
    const downloadURLS = await Promise.all(
      car.gallery.map(async (image, index) => {
        const downloadURL = await uploadBase64ToFirebase(
          image,
          `Images/cars/car_${car.alias}_${index}`,
        );
        return {index, downloadURL};
      }),
    );
    const gallery = downloadURLS
      .sort((a, b) => a.index - b.index)
      .map(({downloadURL}) => downloadURL);
    return this.carRepository.create({...car, gallery, ...parsedEvents});
  }

  @get('/cars/count')
  @response(200, {
    description: 'Car model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Car) where?: Where<Car>): Promise<Count> {
    return this.carRepository.count(where);
  }

  @get('/cars')
  @response(200, {
    description: 'Array of Car model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Car, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Car) filter?: Filter<Car>): Promise<Car[]> {
    return this.carRepository.find(filter);
  }

  @patch('/cars')
  @response(200, {
    description: 'Car PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Car, {partial: true}),
        },
      },
    })
    car: Car,
    @param.where(Car) where?: Where<Car>,
  ): Promise<Count> {
    return this.carRepository.updateAll(car, where);
  }

  @get('/cars/{id}')
  @response(200, {
    description: 'Car model instance',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Car, {includeRelations: true}),
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Car, {exclude: 'where'}) filter?: FilterExcludingWhere<Car>,
  ): Promise<Car> {
    return this.carRepository.findById(id, filter);
  }

  @get('/cars/uid/{uid}')
  @response(200, {
    description: 'Cars model instance by uid',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Car, {includeRelations: true}),
      },
    },
  })
  async findByEmail(
    @param.path.string('uid') uid: string,
    @param.filter(Car, {exclude: 'where'}) filter?: FilterExcludingWhere<Car>,
  ): Promise<Car[]> {
    return this.carRepository.find({where: {uid}}, filter);
  }

  @patch('/cars/{id}')
  @response(204, {
    description: 'Car PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Car, {partial: true}),
        },
      },
    })
    car: Car,
  ): Promise<void> {
    await this.carRepository.updateById(id, car);
  }

  @put('/cars/{id}')
  @response(204, {
    description: 'Car PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() car: Car,
  ): Promise<void> {
    await this.carRepository.replaceById(id, car);
  }

  @del('/cars/{id}')
  @response(204, {
    description: 'Car DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.carRepository.deleteById(id);
  }
}
