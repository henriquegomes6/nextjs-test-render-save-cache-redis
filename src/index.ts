import * as fastify from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

const server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({});

server.get('/ping', async () => {
  return 'pong';
})

server.listen(8080, (err: any, address: any) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
})

