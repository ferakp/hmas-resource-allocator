import initializeServer from './initializeServer';
import apiRouter from './rest-api/v1/router/api';

const app = initializeServer(apiRouter);

app.listen(5000, () => console.log(`Listening on port ${5000}`)); // eslint-disable-line