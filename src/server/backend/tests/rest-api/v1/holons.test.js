import * as app from '../../../app';
import * as testUtils from '../../utils/utils';
import * as db from '../../../relational-database-api/database';
import * as testEnvironment from '../../utils/test-environment';

// Configuring test environment
jest.useRealTimers();
jest.setTimeout(40000);

beforeEach(async () => {
  // Wait server to be set up
  await testUtils.wait(3);

  // Set up test environment
  await testEnvironment.addTestEnvironment(db);
});

afterAll(async () => {
  jest.setTimeout(20000);
  let responseAlg = await db.executeQuery('TRUNCATE algorithms');
  let responseAll = await db.executeQuery('TRUNCATE allocations');
  let responseDas = await db.executeQuery('TRUNCATE dashboard_settings');
  let responseHol = await db.executeQuery('TRUNCATE holons');
  let responseTas = await db.executeQuery('TRUNCATE tasks');
  let responseUse = await db.executeQuery('TRUNCATE users');

  db.endConnection();
  app.stopServer();
});

describe('testing GET /holons endpoint with queries', () => {
  test('get all holons', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('holons', '', token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains three data objects
    expect(result.data.data.length).toBe(3);

    // Response's data object is type of holons
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'holons',
      })
    );

    // Response has correct holons
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        name: 'demoholon1',
      })
    );
    expect(result.data.data[1].attributes).toEqual(
      expect.objectContaining({
        name: 'demoholon2',
      })
    );
    expect(result.data.data[2].attributes).toEqual(
      expect.objectContaining({
        name: 'demoholon3',
      })
    );
  });

  test('get holons that are updated before Date.NOW', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('holons', '?updated_on.elt=' + new Date(), token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains three data objects
    expect(result.data.data.length).toBe(3);

    // Response's data object is type of holons
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'holons',
      })
    );
  });

  test('get holons that are updated before Date.NOW and are type of employee with the name of demoholon1', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('holons', '?updated_on.elt=' + new Date() + '&type=employee&name=demoholon1', token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains three data objects
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of holons
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'holons',
      })
    );
  });

  test('get holon with specific ID', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('holons', '', token);

    const randomHolonId = result.data.data[0].attributes.id;
    result = await testUtils.get('holons/' + randomHolonId, '', token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of holons
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'holons',
      })
    );

    // Response has requested holon
    expect(result.data.data[0].attributes.id).toBe(randomHolonId);
  });

  test('get holon with specific ID, type, name, gender, daily work hours, age, experience years and update time ', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('holons', '', token);

    const randomHolonId = result.data.data[0].attributes.id;
    const query = '?id=' + randomHolonId + '&type=employee&name=demoholon1&gender=man&daily_work_hours=8&age.e=25&experience_years.elt=10&updated_on.elt=' + new Date();
    result = await testUtils.get('holons/', query, token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of holons
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'holons',
      })
    );

    // Response has requested holon
    expect(result.data.data[0].attributes.id).toBe(randomHolonId);
  });

  test('get holon with invalid parameter', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('holons', '?cost_data=2', token);
    let result2 = await testUtils.get('holons', '?co=2', token);
    let result3 = await testUtils.get('holons', '?id=1&de=e', token);

    // Response has correct link
    expect(result.response.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    // Response has an error
    expect(result.response.data.errors.length).toBe(1);
    expect(result2.response.data.errors.length).toBe(1);
    expect(result3.response.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.response.data.data.length).toBe(0);
    expect(result2.response.data.data.length).toBe(0);
    expect(result3.response.data.data.length).toBe(0);

    // Response has requested error
    expect(result.response.data.errors[0].title).toBe('INVALID QUERY STRING KEY');
    expect(result2.response.data.errors[0].title).toBe('INVALID QUERY STRING KEY');
    expect(result3.response.data.errors[0].title).toBe('INVALID QUERY STRING KEY');
  });

  test('get holon with invalid parameter value', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('holons', '?age=aa', token);

    // Response has correct link
    expect(result.response.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    // Response has an error
    expect(result.response.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.response.data.data.length).toBe(0);

    // Response has requested error
    expect(result.response.data.errors[0].title).toBe('INVALID QUERY STRING VALUE');
  });
});

describe('testing PATCH /holons endpoint', () => {
  test('patch the demoholon1 with availability_data', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('holons', '', token);

    const randomHolonId = result.data.data[0].attributes.id;
    const reqParams = { availability_data: JSON.stringify({ currentValue: 0.3 }) };
    result = await testUtils.patch('holons/' + randomHolonId, token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of holons
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'holons',
      })
    );

    // Response has correct holon
    expect(JSON.parse(result.data.data[0].attributes.availability_data).currentValue).toBe(0.3);
    expect(testUtils.isDate(new Date(JSON.parse(result.data.data[0].attributes.availability_data).latestUpdate))).toBe(true);
    expect(JSON.parse(result.data.data[0].attributes.availability_data).records.length).toBe(1);
    expect(JSON.parse(result.data.data[0].attributes.availability_data).records[0].length).toBe(2);
  });

  test('patch the demoholon1 with availability_data twice', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('holons', '', token);

    const randomHolonId = result.data.data[0].attributes.id;
    const reqParams = { availability_data: JSON.stringify({ currentValue: 0.3 }) };
    result = await testUtils.patch('holons/' + randomHolonId, token, reqParams);
    result = await testUtils.patch('holons/' + randomHolonId, token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of holons
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'holons',
      })
    );

    // Response has correct holon
    expect(JSON.parse(result.data.data[0].attributes.availability_data).currentValue).toBe(0.3);
    expect(testUtils.isDate(new Date(JSON.parse(result.data.data[0].attributes.availability_data).latestUpdate))).toBe(true);
    expect(JSON.parse(result.data.data[0].attributes.availability_data).records.length).toBe(2);
    expect(JSON.parse(result.data.data[0].attributes.availability_data).records[0].length).toBe(2);
    expect(JSON.parse(result.data.data[0].attributes.availability_data).records[1].length).toBe(2);
  });

  test('patch the demoholon1 with cost_data, load_data and stress_data', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('holons', '', token);

    const randomHolonId = result.data.data[0].attributes.id;
    const reqParams = { cost_data: JSON.stringify({ currentValue: 0.3 }), load_data: JSON.stringify({ currentValue: 0.1 }), stress_data: JSON.stringify({ currentValue: 0.5 }) };
    result = await testUtils.patch('holons/' + randomHolonId, token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of holons
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'holons',
      })
    );

    // Response has correct holon
    expect(JSON.parse(result.data.data[0].attributes.cost_data).currentValue).toBe(0.3);
    expect(JSON.parse(result.data.data[0].attributes.load_data).currentValue).toBe(0.1);
    expect(JSON.parse(result.data.data[0].attributes.stress_data).currentValue).toBe(0.5);

    expect(testUtils.isDate(new Date(JSON.parse(result.data.data[0].attributes.cost_data).latestUpdate))).toBe(true);
    expect(testUtils.isDate(new Date(JSON.parse(result.data.data[0].attributes.load_data).latestUpdate))).toBe(true);
    expect(testUtils.isDate(new Date(JSON.parse(result.data.data[0].attributes.stress_data).latestUpdate))).toBe(true);

    expect(JSON.parse(result.data.data[0].attributes.cost_data).records.length).toBe(1);
    expect(JSON.parse(result.data.data[0].attributes.load_data).records.length).toBe(1);
    expect(JSON.parse(result.data.data[0].attributes.stress_data).records.length).toBe(1);

    expect(JSON.parse(result.data.data[0].attributes.cost_data).records[0].length).toBe(2);
    expect(JSON.parse(result.data.data[0].attributes.load_data).records[0].length).toBe(2);
    expect(JSON.parse(result.data.data[0].attributes.stress_data).records[0].length).toBe(2);
  });

  test('patch the demoholon1 with new name, age, type, gender and daily_work_hours', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('holons', '', token);

    const randomHolonId = result.data.data[0].attributes.id;
    const reqParams = { name: 'customHolon', age: 22, type: 'customEmployee', gender: 'custom', daily_work_hours: 13 };
    result = await testUtils.patch('holons/' + randomHolonId, token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of holons
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'holons',
      })
    );

    // Response has correct holon
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        name: 'customHolon',
        age: '22',
        type: 'customEmployee',
        gender: 'custom',
        daily_work_hours: '13',
      })
    );
  });

  test('patch the demoholon1 with invalid parameter', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('holons', '', token);

    const randomHolonId = result.data.data[0].attributes.id;
    const reqParams = { nameasd: 'customHolon', age: 22, type: 'customEmployee', gender: 'custom', daily_work_hours: 13 };
    result = await testUtils.patch('holons/' + randomHolonId, token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    // Response has an error
    expect(result.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.data.data.length).toBe(0);

    // Response has correct holon
    expect(result.data.errors[0].title).toBe('INVALID PARAMETER NAMES');
  });

  test('patch the demoholon1 with invalid parameter value', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('holons', '', token);

    const randomHolonId = result.data.data[0].attributes.id;
    const reqParams = { name: 'customHolon', age: 'aa', type: 'customEmployee', gender: 'custom', daily_work_hours: 13 };
    result = await testUtils.patch('holons/' + randomHolonId, token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    // Response has an error
    expect(result.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.data.data.length).toBe(0);

    // Response has correct holon
    expect(result.data.errors[0].title).toBe('INVALID PARAMETER VALUES');
  });

  test('patch the demoholon2 with insufficient privileges', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('holons', '', token);

    const randomHolonId = result.data.data[1].attributes.id;
    const reqParams = { name: 'customHolon', age: 22, type: 'customEmployee', gender: 'custom', daily_work_hours: 13 };
    result = await testUtils.patch('holons/' + randomHolonId, token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    testUtils.hasError(result, 'INSUFFICIENT PRIVILEGES');
  });
});

describe('testing DELETE /holons endpoint', () => {
  test('delete moderator holon as user', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('holons', '', token);

    const randomHolonId = result.data.data[1].attributes.id;
    result = await testUtils.del('holons/' + randomHolonId, token);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    testUtils.hasError(result, 'INSUFFICIENT PRIVILEGES');
  });

  test('delete admin holon as moderator', async () => {
    let result = await testUtils.login('moderator', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('holons', '', token);

    const randomHolonId = result.data.data[2].attributes.id;
    result = await testUtils.del('holons/' + randomHolonId, token);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    testUtils.hasError(result, 'INSUFFICIENT PRIVILEGES');
  });

  test('delete user holon as user', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('holons', '', token);

    const randomHolonId = result.data.data[0].attributes.id;
    result = await testUtils.del('holons/' + randomHolonId, token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of holons
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'holons',
      })
    );

    // Response has correct holon
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        id: randomHolonId,
      })
    );
  });

  test('delete moderator holon as moderator', async () => {
    let result = await testUtils.login('moderator', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('holons', '', token);

    const randomHolonId = result.data.data[1].attributes.id;
    result = await testUtils.del('holons/' + randomHolonId, token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of holons
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'holons',
      })
    );

    // Response has correct holon
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        id: randomHolonId,
      })
    );
  });

  test('delete admin holon as admin', async () => {
    let result = await testUtils.login('admin', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('holons', '', token);

    const randomHolonId = result.data.data[2].attributes.id;
    result = await testUtils.del('holons/' + randomHolonId, token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of holons
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'holons',
      })
    );

    // Response has correct holon
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        id: randomHolonId,
      })
    );
  });
});

describe('testing POST /holons endpoint', () => {
  test('create a new holon with correct and required parameters and values', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    const reqParams = { name: 'customHolon', age: 22, type: 'customEmployee', gender: 'custom', daily_work_hours: 13, experience_years: 4 };
    result = await testUtils.post('holons/', token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of holons
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'holons',
      })
    );

    // Response has correct holon
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        name: 'customHolon',
        age: '22',
        type: 'customEmployee',
        gender: 'custom',
        daily_work_hours: '13',
        experience_years: '4',
      })
    );
  });

  test('create a new holon with correct and required parameters and values, and additional data', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    const tempData = { currentValue: 0.6 };
    const reqParams = {
      name: 'customHolon',
      age: 22,
      type: 'customEmployee',
      gender: 'custom',
      daily_work_hours: 13,
      experience_years: 4,
      cost_data: JSON.stringify(tempData),
      availability_data: JSON.stringify(tempData),
      load_data: JSON.stringify(tempData),
      stress_data: JSON.stringify(tempData),
    };
    result = await testUtils.post('holons/', token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of holons
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'holons',
      })
    );

    // Response has correct holon
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        name: 'customHolon',
        age: '22',
        type: 'customEmployee',
        gender: 'custom',
        daily_work_hours: '13',
        experience_years: '4',
      })
    );

    expect(JSON.parse(result.data.data[0].attributes.cost_data).currentValue).toBe(0.6);
    expect(JSON.parse(result.data.data[0].attributes.load_data).currentValue).toBe(0.6);
    expect(JSON.parse(result.data.data[0].attributes.availability_data).currentValue).toBe(0.6);
    expect(JSON.parse(result.data.data[0].attributes.stress_data).currentValue).toBe(0.6);
  });

  test('create a new holon with incorrect parameter name', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    const tempData = { currentValue: 0.6 };
    const reqParams = {
      names: 'customHolon',
      age: 22,
      type: 'customEmployee',
      gender: 'custom',
      daily_work_hours: 13,
      experience_years: 4,
      cost_data: JSON.stringify(tempData),
      availability_data: JSON.stringify(tempData),
      load_data: JSON.stringify(tempData),
      stress_data: JSON.stringify(tempData),
    };
    result = await testUtils.post('holons/', token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    testUtils.hasError(result, 'MISSING OR INVALID PARAMETERS');
  });

  test('create a new holon with incorrect parameter value', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    const tempData = { currentValuse: 0.6 };
    const reqParams = {
      name: 'customHolon',
      age: 22,
      type: 'customEmployee',
      gender: 'custom',
      daily_work_hours: 13,
      experience_years: 4,
      cost_data: JSON.stringify(tempData),
      availability_data: JSON.stringify(tempData),
      load_data: JSON.stringify(tempData),
      stress_data: JSON.stringify(tempData),
    };
    result = await testUtils.post('holons/', token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    testUtils.hasError(result, 'INVALID PARAMETER VALUES');
  });

  test('create a new holon with incorrect parameter value', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    const tempData = { currentValuse: 0.6 };
    const reqParams = {
      name: 13,
      age: 22,
      type: 'customEmployee',
      gender: 'custom',
      daily_work_hours: 13,
      experience_years: 4,
      cost_data: JSON.stringify(tempData),
      availability_data: JSON.stringify(tempData),
      load_data: JSON.stringify(tempData),
      stress_data: JSON.stringify(tempData),
    };
    result = await testUtils.post('holons/', token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/holons') }),
      })
    );

    testUtils.hasError(result, 'INVALID PARAMETER VALUES');
  });
});
