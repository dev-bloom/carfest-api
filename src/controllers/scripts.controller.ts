import {inject} from '@loopback/core';
import {
  Request,
  ResponseObject,
  RestBindings,
  get,
  response,
} from '@loopback/rest';
import {loadTimes} from '../scripts/loadTimes';

const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

export class ScriptsController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  @get('/loadTimes')
  @response(200, PING_RESPONSE)
  async ping(): Promise<object> {
    const times = await loadTimes();
    // Reply with a greeting, the current time, the url, and request headers
    return times;
  }
}
