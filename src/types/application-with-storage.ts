import {FirebaseStorage} from '@firebase/storage-types';
import {ApplicationWithServices} from '@loopback/service-proxy';

export interface ApplicationWithStorage extends ApplicationWithServices {
  storage: FirebaseStorage;
}
