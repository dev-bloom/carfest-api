import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Qr, QrRelations} from '../models';

export class QrRepository extends DefaultCrudRepository<
  Qr,
  typeof Qr.prototype.id,
  QrRelations
> {
  constructor(@inject('datasources.mongo') dataSource: MongoDataSource) {
    super(Qr, dataSource);
  }
}
