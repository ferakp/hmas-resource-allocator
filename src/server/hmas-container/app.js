import initializeServer from './initializeServer';
import apiRouter from './rest-api/v1/router/api';

const app = initializeServer(apiRouter);

const server = app.listen(5001, () => console.log(`Listening on port ${5000}`)); // eslint-disable-line

export const stopServer = () => {
    server.close((err) => {
    });
}