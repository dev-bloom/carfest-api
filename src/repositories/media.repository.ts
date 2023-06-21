import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Media, MediaRelations} from '../models';

export class MediaRepository extends DefaultCrudRepository<
  Media,
  typeof Media.prototype.id,
  MediaRelations
> {
  constructor(@inject('datasources.mongo') dataSource: MongoDataSource) {
    super(Media, dataSource);
  }
}
