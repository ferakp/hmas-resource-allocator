import * as app from '../../../app';
import * as testUtils from '../../utils/utils';
import * as db from '../../../relational-database-api/database';
import * as testEnvironment from '../../utils/test-environment';

// Configuring test environment
jest.useRealTimers();
jest.setTimeout(40000);

beforeEach(async () => {
  // Waiting server to start
  await testUtils.wait(5);

  // Set up test environment
  await testEnvironment.addTestEnvironment(db);
});

afterAll(async () => {
  jest.setTimeout(20000);
  let responseAlg = await db.executeQuery('TRUNCATE algorithms CASCADE');
  let responseAll = await db.executeQuery('TRUNCATE algorithms CASCADE');
  let responseDas = await db.executeQuery('TRUNCATE dashboard_settings CASCADE');
  let responseTas = await db.executeQuery('TRUNCATE tasks CASCADE');
  let responseUse = await db.executeQuery('TRUNCATE users CASCADE');
  let responseHol = await db.executeQuery('TRUNCATE holons CASCADE');

  db.endConnection();
  app.stopServer();
});

describe('testing GET /algorithms endpoint with queries', () => {
  test('get all algorithms', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('algorithms', '', token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/algorithms') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(2);

    // Response's data object has correct type
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'algorithms',
      })
    );

    // Response has correct resources
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        name: 'AlgorithmName',
      })
    );
    expect(result.data.data[1].attributes).toEqual(
      expect.objectContaining({
        name: 'AlgorithmName2',
      })
    );
  });

  test('get all algorithms with the query string keys updated_on.elt and created_on.elt', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('algorithms', '?updated_on.elt=' + new Date('2200-06-10T18:24:21.381Z') + '&created_on.elt=' + new Date('2200-06-10T18:24:21.381Z'), token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/algorithms') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(2);

    // Response's data object has correct type
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'algorithms',
      })
    );
  });

  test('get algorithm with the query string key id', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('algorithms', '', token);
    const randomAlgorithmId = result.data.data[0].attributes.id;
    result = await testUtils.get('algorithms', '?id=' + randomAlgorithmId, token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/algorithms') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(1);

    // Response's data object has correct type
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'algorithms',
      })
    );

    result.data.data[0].attributes.id = Number(result.data.data[0].attributes.id);
    // Response has correct resources
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        id: Number(randomAlgorithmId),
      })
    );
  });

  test('get algorithm with all query string keys: id, type, name, updated_on.elt, created_on.elt, created_by', async () => {
    let result = await testUtils.login('user', 'password');
    const userId = result.data.data[0].attributes.id;
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('algorithms', '', token);
    const randomAlgorithmId = result.data.data[0].attributes.id;
    result = await testUtils.get(
      'algorithms',
      '?updated_on.elt=' +
        new Date('2200-06-10T18:24:21.381Z') +
        '&created_on.elt=' +
        new Date('2200-06-10T18:24:21.381Z') +
        '&type=general&name=AlgorithmName&id=' +
        randomAlgorithmId+"&created_by="+userId,
      token
    );

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/algorithms') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(1);

    // Response's data object has correct type
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'algorithms',
      })
    );

    // Response has correct resources
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        id: randomAlgorithmId,
      })
    );
  });

  test('get algorithms with invalid query string key', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('algorithms', '?updatesd_on.elt=' + new Date('2200-06-10T18:24:21.381Z') + '&created_on.elt=' + new Date('2200-06-10T18:24:21.381Z'), token);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/algorithms') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(1);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(0);

    // Response has correct errpr
    expect(result.data.errors[0].title).toBe('INVALID QUERY STRING KEY');
  });

  test('get algorithms with invalid query string value', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('algorithms', '?updated_on.elt=' + 'ADADADA' + '&created_on.elt=' + new Date('2200-06-10T18:24:21.381Z'), token);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/algorithms') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(1);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(0);

    // Response has correct errpr
    expect(result.data.errors[0].title).toBe('INVALID QUERY STRING VALUE');
  });
});

describe('testing POST /algorithms endpoint with parameters', () => {
  test('post algorithm with required parameters: type, name, description', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    const reqParams = { type: 'test', name: 'test', description: 'test' };
    result = await testUtils.post('algorithms/', token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/algorithms') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of holons
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'algorithms',
      })
    );

    // Response has correct resource
    expect(result.data.data[0].attributes.type).toBe('test');
    expect(result.data.data[0].attributes.name).toBe('test');
    expect(result.data.data[0].attributes.description).toBe('test');
  });

  test('post algorithm with no parameters', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    const reqParams = {};
    result = await testUtils.post('algorithms/', token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/algorithms') }),
      })
    );

    // Response has correct amount of errors
    expect(result.data.errors.length).toBe(1);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(0);

    // Response has correct error title
    expect(result.data.errors[0].title).toBe('MISSING OR INVALID PARAMETERS');
  });

  test('post algorithm with invalid parameter name', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    const reqParams = { adad: 'a', type: JSON.stringify({}), name: 's', description: 's' };
    result = await testUtils.post('algorithms/', token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/algorithms') }),
      })
    );

    // Response has correct amount of errors
    expect(result.data.errors.length).toBe(1);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(0);

    // Response has correct error title
    expect(result.data.errors[0].title).toBe('INVALID PARAMETER NAMES');
  });

  test('post algorithm with invalid parameter value', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    const reqParams = { type: JSON.stringify({}), name: '', description: {} };
    result = await testUtils.post('algorithms/', token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/algorithms') }),
      })
    );

    // Response has correct amount of errors
    expect(result.data.errors.length).toBe(1);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(0);

    // Response has correct error title
    expect(result.data.errors[0].title).toBe('INVALID PARAMETER VALUES');
  });
});

describe('testing PATCH /algorithms endpoint with parameters', () => {
  test('patch algorithm with all parameters: type, name, description', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('algorithms', '', token);

    const randomAlgorithmId = result.data.data[0].attributes.id;
    const reqParams = { type: 'test', name: 'test', description: 'test' };
    result = await testUtils.patch('algorithms/' + randomAlgorithmId, token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/algorithms') }),
      })
    );

    // Response has correct amount of errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of algorithms
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'algorithms',
      })
    );

    // Response has correct resource
    expect(result.data.data[0].attributes.type).toBe('test');
    expect(result.data.data[0].attributes.name).toBe('test');
    expect(result.data.data[0].attributes.description).toBe('test');
  });

  test('patch algorithm with no parameters', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('algorithms', '', token);

    const randomAlgorithmId = result.data.data[0].attributes.id;
    const reqParams = {};
    result = await testUtils.patch('algorithms/' + randomAlgorithmId, token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/algorithms') }),
      })
    );

    // Response has correct amount of errors
    expect(result.data.errors.length).toBe(1);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(0);

    // Response has correct error title
    expect(result.data.errors[0].title).toBe('MISSING OR INVALID PARAMETERS');
  });

  test('patch algorithm with invalid parameter name', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('algorithms', '', token);

    const randomAlgorithmId = result.data.data[0].attributes.id;
    const reqParams = { type: 's', jsjs: 'a' };
    result = await testUtils.patch('algorithms/' + randomAlgorithmId, token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/algorithms') }),
      })
    );

    // Response has correct amount of errors
    expect(result.data.errors.length).toBe(1);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(0);

    // Response has correct error title
    expect(result.data.errors[0].title).toBe('INVALID PARAMETER NAMES');
  });

  test('patch algorithm with invalid parameter value', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('algorithms', '', token);

    const randomAlgorithmId = result.data.data[0].attributes.id;
    const reqParams = { type: {} };
    result = await testUtils.patch('algorithms/' + randomAlgorithmId, token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/algorithms') }),
      })
    );

    // Response has correct amount of errors
    expect(result.data.errors.length).toBe(1);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(0);

    // Response has correct error title
    expect(result.data.errors[0].title).toBe('INVALID PARAMETER VALUES');
  });
});

describe('testing DELETE /algorithms endpoint', () => {
  test('delete algorithm', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('algorithms', '', token);

    const randomAlgorithmId = result.data.data[0].attributes.id;
    result = await testUtils.del('algorithms/' + randomAlgorithmId, token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/algorithms') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of algorithms
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'algorithms',
      })
    );

    // Response has correct algorithm
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        id: randomAlgorithmId,
      })
    );
  });

  test('delete non-exist algorithm', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.del('algorithms/0', token);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/algorithms') }),
      })
    );

    // Response has an error
    expect(result.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.data.data.length).toBe(0);

    // Response has correct error
    expect(result.data.errors[0].title).toBe('ALGORITHM NOT FOUND');
  });
});
