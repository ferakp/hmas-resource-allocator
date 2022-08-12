import initializeServer from './initializeServer';
import apiRouter from './rest-api/v1/router/api';
import * as graphApi from './graph-database/api';

const app = initializeServer(apiRouter);

const server = app.listen(5000, () => console.log(`Listening on port ${5000}`)); // eslint-disable-line

export const stopServer = () => {
    graphApi.stop();
    server.close((err) => {
    });
}