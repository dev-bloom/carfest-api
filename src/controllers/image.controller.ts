import {inject} from '@loopback/core';
import {post, requestBody} from '@loopback/rest';
import {ApplicationWithServices} from '@loopback/service-proxy';
import {getStorage} from 'firebase/storage';

export class ImageFileController {
  constructor(
    @inject('services.Application') protected app: ApplicationWithServices,
  ) {}

  @post('/upload')
  async upload(@requestBody.file() file: Buffer) {
    const storage = getStorage();
    console.debug('storage', storage);
    console.debug('file', file);
    return true;
  }
}
