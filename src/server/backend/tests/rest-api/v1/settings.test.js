import * as app from '../../../app';
import * as testUtils from '../../utils/utils';
import * as db from '../../../relational-database-api/database';
import * as testEnvironment from '../../utils/test-environment';

// Configuring test environment
jest.useRealTimers();
jest.setTimeout(40000);

beforeEach(async () => {
  // Waiting server to start
  await testUtils.wait(3);

  // Set up test environment
  await testEnvironment.addTestEnvironment(db);
});

afterAll(async () => {
  jest.setTimeout(20000);
  let responseAlg = await db.executeQuery('TRUNCATE algorithms CASCADE');
  let responseAll = await db.executeQuery('TRUNCATE allocations CASCADE');
  let responseDas = await db.executeQuery('TRUNCATE dashboard_settings CASCADE');
  let responseTas = await db.executeQuery('TRUNCATE tasks CASCADE');
  let responseUse = await db.executeQuery('TRUNCATE users CASCADE');
  let responseHol = await db.executeQuery('TRUNCATE holons CASCADE');

  db.endConnection();
  app.stopServer();
});

describe('testing GET /settings endpoint with queries', () => {
  test('get all settings with given credentials', async () => {
    let resultUser = await testUtils.login('user', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const result = await testUtils.get('settings', '', token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/settings') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains three data objects
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of tasks
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'settings',
      })
    );

    // Response has correct tasks
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        settings: JSON.stringify({ holonsUpdate: 5, tasksUpdate: 5 }),
      })
    );
  });

  test('get all settings with given admin credentials', async () => {
    let resultUser = await testUtils.login('admin', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const result = await testUtils.get('settings', '', token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/settings') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains three data objects
    expect(result.data.data.length).toBe(3);

    // Response's data object is type of settigs
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'settings',
      })
    );

    expect(result.data.data[1]).toEqual(
      expect.objectContaining({
        type: 'settings',
      })
    );

    expect(result.data.data[2]).toEqual(
      expect.objectContaining({
        type: 'settings',
      })
    );

    // Response has correct settings
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        settings: JSON.stringify({ holonsUpdate: 5, tasksUpdate: 5 }),
      })
    );

    expect(result.data.data[1].attributes).toEqual(
      expect.objectContaining({
        settings: JSON.stringify({ holonsUpdate: 5, tasksUpdate: 5 }),
      })
    );

    expect(result.data.data[2].attributes).toEqual(
      expect.objectContaining({
        settings: JSON.stringify({ holonsUpdate: 5, tasksUpdate: 5 }),
      })
    );
  });

  test('get settings that are updated before Date.NOW with invalid parameter', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('settings', '?updated_on.elt=' + new Date() + '&ts=2', token);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/settings') }),
      })
    );

    // Response has an error
    expect(result.data.errors.length).toBe(1);

    // Response contains no data objects
    expect(result.data.data.length).toBe(0);

    // Response's error has correct title
    expect(result.data.errors[0].title).toBe('INVALID QUERY STRING KEY');
  });

  test('get settings that are updated before Date.NOW with id', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;

    const settingsResults = await testUtils.get('settings', '', token);
    result = await testUtils.get('settings', '?updated_on.elt=' + new Date() + '&id=' + settingsResults.data.data[0].attributes.id, token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/settings') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of settings
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'settings',
      })
    );
  });

  test('get settings that are updated before Date.NOW with random (non-exist) id', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('settings', '?updated_on.elt=' + new Date() + '&id=111111111', token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/settings') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(0);
  });
});

describe('testing PATCH /settings endpoint', () => {
  test('patch the settings2 with new settings using insufficient credentials', async () => {
    let result = await testUtils.login('admin', 'password');
    let token = result.data.data[0].attributes.token;
    result = await testUtils.get('settings', '', token);
    const randomSettingsId = result.data.data[1].attributes.id;

    result = await testUtils.login('user', 'password');
    token = result.data.data[0].attributes.token;
    const reqParams = { settings: JSON.stringify({ customHolonUpdate: 4 }) };
    result = await testUtils.patch('settings/' + randomSettingsId, token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/settings') }),
      })
    );

    // Response has an error
    expect(result.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.data.data.length).toBe(0);

    // Response has correct error
    expect(result.data.errors[0].title).toBe('INSUFFICIENT PRIVILEGES');
  });
  
  test('patch the settings1 with new settings', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('settings', '', token);

    const randomSettingsId = result.data.data[0].attributes.id;
    const reqParams = { settings: JSON.stringify({ customHolonUpdate: 4 }) };
    result = await testUtils.patch('settings/' + randomSettingsId, token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/settings') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of settings
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'settings',
      })
    );

    // Response has correct settings
    expect(JSON.parse(result.data.data[0].attributes.settings).customHolonUpdate).toBe(4);
  });

  test('patch the settings1 with invalid parameter name', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('settings', '', token);

    const randomSettingsId = result.data.data[0].attributes.id;
    const reqParams = { setstings: JSON.stringify({ customHolonUpdate: 4 }) };
    result = await testUtils.patch('settings/' + randomSettingsId, token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/settings') }),
      })
    );

    // Response has an error
    expect(result.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.data.data.length).toBe(0);

    // Response has correct error
    expect(result.data.errors[0].title).toBe('INVALID PARAMETER NAMES');
  });

  test('patch the settings1 with invalid parameter name', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('settings', '', token);

    const randomSettingsId = result.data.data[0].attributes.id;
    const reqParams = { settings: JSON.stringify({ customHolonUpdate: 4 }) };
    for (let i = 0; i < 201; i++) {
      let settings = JSON.parse(reqParams.settings);
      settings['attr' + i] = i;
      reqParams.settings = JSON.stringify(settings);
    }
    result = await testUtils.patch('settings/' + randomSettingsId, token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/settings') }),
      })
    );

    // Response has an error
    expect(result.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.data.data.length).toBe(0);

    // Response has correct error
    expect(result.data.errors[0].title).toBe('MAX SETTINGS SIZE EXCEEDED');
  });

  test('patch the settings1 with invalid parameter name', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('settings', '', token);

    const randomSettingsId = result.data.data[0].attributes.id;
    const reqParams = { settings: JSON.stringify({}) };
    result = await testUtils.patch('settings/' + randomSettingsId, token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/settings') }),
      })
    );

    // Response has an error
    expect(result.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.data.data.length).toBe(0);

    // Response has correct error
    expect(result.data.errors[0].title).toBe('MISSING SETTINGS');
  });
});

describe('testing POST /settings endpoint', () => {
  test('post a new settings', async () => {
    // Empty table
    await db.executeQuery('TRUNCATE dashboard_settings CASCADE');
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    const reqParams = { settings: JSON.stringify({ customHolonUpdate: 4 }) };
    result = await testUtils.post('settings/', token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/settings') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of settings
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'settings',
      })
    );

    // Response has correct task
    expect(JSON.parse(result.data.data[0].attributes.settings).customHolonUpdate).toBe(4);
    expect(result.data.data[0].attributes.created_by).not.toBeNull();
    expect(result.data.data[0].attributes.updated_on).not.toBeNull();
    expect(result.data.data[0].attributes.created_on).not.toBeNull();
  });

  test('post a new settings with invalid parameter name', async () => {
    // Empty table
    await db.executeQuery('TRUNCATE dashboard_settings CASCADE');
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    const reqParams = { asda: 2, settings: JSON.stringify({ customHolonUpdate: 4 }) };
    result = await testUtils.post('settings/', token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/settings') }),
      })
    );

    // Response has an error
    expect(result.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.data.data.length).toBe(0);

    // Response has correct error
    expect(result.data.errors[0].title).toBe('INVALID PARAMETER NAMES');
  });

  test('post a new settings with missing settings', async () => {
    // Empty table
    await db.executeQuery('TRUNCATE dashboard_settings CASCADE');
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    const reqParams = { settings: JSON.stringify({}) };
    result = await testUtils.post('settings/', token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/settings') }),
      })
    );

    // Response has an error
    expect(result.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.data.data.length).toBe(0);

    // Response has correct error
    expect(result.data.errors[0].title).toBe('MISSING SETTINGS');
  });
});

describe('testing DELETE /settings endpoint', () => {
  test('delete a settings with insufficient user privileges', async () => {
    let result = await testUtils.login('admin', 'password');
    let token = result.data.data[0].attributes.token;
    result = await testUtils.get('settings', '', token);
    const randomSettingsId = result.data.data[1].attributes.id;

    result = await testUtils.login('user', 'password');
    token = result.data.data[0].attributes.token;
    result = await testUtils.del('settings/' + randomSettingsId, token);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/settings') }),
      })
    );

    // Response has an error
    expect(result.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.data.data.length).toBe(0);

    // Response has correct task
    expect(result.data.errors[0].title).toBe('INSUFFICIENT PRIVILEGES');
  });

  test('delete a settings with insufficient moderator privileges', async () => {
    let result = await testUtils.login('admin', 'password');
    let token = result.data.data[0].attributes.token;
    result = await testUtils.get('settings', '', token);
    const randomSettingsId = result.data.data[2].attributes.id;

    result = await testUtils.login('moderator', 'password');
    token = result.data.data[0].attributes.token;
    result = await testUtils.del('settings/' + randomSettingsId, token);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/settings') }),
      })
    );

    // Response has an error
    expect(result.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.data.data.length).toBe(0);

    // Response has correct error
    expect(result.data.errors[0].title).toBe('INSUFFICIENT PRIVILEGES');
  });

  test('delete a settings as an user', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('settings', '', token);

    const randomSettingsId = result.data.data[0].attributes.id;
    result = await testUtils.del('settings/' + randomSettingsId, token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/settings') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response has correct settings
    expect(result.data.data[0].attributes.id).toBe(randomSettingsId);
  });
});
