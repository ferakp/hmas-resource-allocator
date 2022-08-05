import initializeServer from './initializeServer';
import apiRouter from './rest-api/v1/router/api';
import * as logger from './logger/logger';
import * as core from './core/core';
import * as container from './container/container';
import * as backendApi from './api/backend-api';

const app = initializeServer(apiRouter);

if (!process.env.PORT || !process.env.HOST) {
  console.log('Unable to start the server due to lack of PORT and HOST .env variables');
  process.exit();
}
const server = app.listen(process.env.PORT, process.env.HOST, () => console.log(`Listening on port ${process.env.PORT}`)); // eslint-disable-line

export const stopServer = () => {
  logger.stop();
  core.stop();
  container.stop();
  backendApi.stop();
  server.close((err) => {
    if (err) console.log(err);
  });
};
