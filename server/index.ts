import next from 'next';

import fastify from 'fastify';
import { Server, ServerResponse } from 'http';
import { isBlockedPage, isInternalUrl } from 'next-server/dist/server/utils';

const server = fastify<Server, any, ServerResponse>({});

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  server.get('*', async (request, reply) => {
    try {
      const { req } = request;
      const { res } = reply;

      const pathName = req.originalUrl;
      if (isInternalUrl(req.url)) {
        return handle(req, res, req.originalUrl);
      }

      if (isBlockedPage(pathName)) {
        return app.render404(req, res, req.originalUrl);
      }

      req.locals = {};
      req.locals.context = {};
      const html = await app.renderToHTML(req, res, '/', {});

      // Handle client redirects
      const context = req.locals.context;
      if (context.url) {
        return reply.redirect(context.url);
      }

      // Handle client response statuses
      if (context.status) {
        return reply.status(context.status).send();
      }

      // Request was ended by the user
      if (html === null) {
        return;
      }
      reply.header('Content-Type', 'text/html')
      reply.send(html);
    } catch (e) {
      console.error(e);
    }

  });

  server.get('/ping', async () => {
    return 'pong';
  });

  server.listen(port, (err: any, address: any) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });

});

