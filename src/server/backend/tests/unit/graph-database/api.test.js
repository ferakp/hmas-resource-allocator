import * as app from '../../../app';
import * as api from '../../../graph-database/api';
import * as testUtils from '../../utils/utils';
import * as db from '../../../relational-database-api/database';

// Configuring test environment
jest.useRealTimers();
jest.setTimeout(40000);

afterAll(async () => {
  api.stop();
  db.endConnection();
  app.stopServer();
  await testUtils.wait(2);
});

describe('test graph database api', () => {
  test('create user using createUser function', async () => {
    await testUtils.wait(3);
    const response = await api.createAccount('Julius', 'password');
    expect(response).toBe(true);
  });

  test('create user using registerAccount function', async () => {
    api.registerAccount('Kayttaja', 'salasana');
    await testUtils.wait(2);
    expect(api.newUsers.length).toBe(0);
  });
});
