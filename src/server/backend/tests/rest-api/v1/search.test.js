import * as app from '../../../app';
import * as testUtils from '../../utils/utils';
import * as db from '../../../relational-database-api/database';
import * as testEnvironment from '../../utils/test-environment';

// Configuring test environment
jest.useRealTimers();
jest.setTimeout(180000);

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
  let responseHol = await db.executeQuery('TRUNCATE tasks');
  let responseTas = await db.executeQuery('TRUNCATE tasks');
  let responseUse = await db.executeQuery('TRUNCATE users');

  db.endConnection();
  app.stopServer();
});

describe('test POST /search endpoint with parameters', () => {
  test('bulk-search for users with user privilege', async () => {
    let resultAdmin = await testUtils.login('admin', 'password');
    const allUsers = await testUtils.get('users', '', resultAdmin.data.data[0].attributes.token);
    const allUserIds = allUsers.data.data.map((u) => Number(u.id));
    let resultUser = await testUtils.login('user', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const reqParams = { type: 'bulk-search', resource: 'users', ids: [0, ...allUserIds] };
    const result = await testUtils.post('search', token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of users
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of users
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'users',
      })
    );

    // Response has correct user
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        id: allUserIds[0],
      })
    );
  });

  test('bulk-search for users with moderator privilege', async () => {
    let resultAdmin = await testUtils.login('admin', 'password');
    const allUsers = await testUtils.get('users', '', resultAdmin.data.data[0].attributes.token);
    const allUserIds = allUsers.data.data.map((u) => Number(u.id));

    let resultUser = await testUtils.login('moderator', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const reqParams = { type: 'bulk-search', resource: 'users', ids: [0, ...allUserIds] };
    const result = await testUtils.post('search', token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of users
    expect(result.data.data.length).toBe(2);

    // Response's data object is type of users
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'users',
      })
    );
  });

  test('bulk-search for users with admin privilege', async () => {
    let resultAdmin = await testUtils.login('admin', 'password');
    const allUsers = await testUtils.get('users', '', resultAdmin.data.data[0].attributes.token);
    const allUserIds = allUsers.data.data.map((u) => Number(u.id));

    let resultUser = await testUtils.login('admin', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const reqParams = { type: 'bulk-search', resource: 'users', ids: [0, ...allUserIds] };
    const result = await testUtils.post('search', token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of users
    expect(result.data.data.length).toBe(3);

    // Response's data object is type of users
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'users',
      })
    );
  });

  test('bulk-search for tasks', async () => {
    let resultAdmin = await testUtils.login('admin', 'password');
    const allTasks = await testUtils.get('tasks', '', resultAdmin.data.data[0].attributes.token);
    const allTaskIds = allTasks.data.data.map((u) => Number(u.id));

    let resultUser = await testUtils.login('admin', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const reqParams = { type: 'bulk-search', resource: 'tasks', ids: [0, ...allTaskIds] };
    const result = await testUtils.post('search', token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of tasks
    expect(result.data.data.length).toBe(allTaskIds.length);

    // Response's data object is type of tasks
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'tasks',
      })
    );
  });

  test('bulk-search for holons', async () => {
    let resultAdmin = await testUtils.login('admin', 'password');
    const allHolons = await testUtils.get('holons', '', resultAdmin.data.data[0].attributes.token);
    const allHolonIds = allHolons.data.data.map((u) => Number(u.id));

    let resultUser = await testUtils.login('admin', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const reqParams = { type: 'bulk-search', resource: 'holons', ids: [0, ...allHolonIds] };
    const result = await testUtils.post('search', token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of holons
    expect(result.data.data.length).toBe(allHolonIds.length);

    // Response's data object is type of holons
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'holons',
      })
    );
  });

  test('bulk-search for allocations', async () => {
    let resultAdmin = await testUtils.login('admin', 'password');
    const allAllocations = await testUtils.get('allocations', '', resultAdmin.data.data[0].attributes.token);
    const allAllocationIds = allAllocations.data.data.map((u) => Number(u.id));

    let resultUser = await testUtils.login('admin', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const reqParams = { type: 'bulk-search', resource: 'allocations', ids: [0, ...allAllocationIds] };
    const result = await testUtils.post('search', token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of allocations
    expect(result.data.data.length).toBe(allAllocationIds.length);

    // Response's data object is type of allocations
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'allocations',
      })
    );
  });

  test('bulk-update-check for users with user privilege', async () => {
    let resultAdmin = await testUtils.login('admin', 'password');
    const allUsers = await testUtils.get('users', '', resultAdmin.data.data[0].attributes.token);
    const allUserIds = allUsers.data.data.map((u) => Number(u.id));

    let resultUser = await testUtils.login('user', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const reqParams = { type: 'bulk-update-check', resource: 'users', ids: [0, ...allUserIds] };
    const result = await testUtils.post('search', token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of objects
    expect(result.data.data.length).toBe(1);

    // Response's data object has correct type
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'bulk-update-check',
      })
    );

    // Response contains correct amount of updateResources and deletedIds
    expect(result.data.data[0].attributes.updatedResources.length).toBe(1);
    expect(result.data.data[0].attributes.deletedIds.length).toBe(1);
  });

  test('bulk-update-check for users with moderator privilege', async () => {
    let resultAdmin = await testUtils.login('admin', 'password');
    const allUsers = await testUtils.get('users', '', resultAdmin.data.data[0].attributes.token);
    const allUserIds = allUsers.data.data.map((u) => Number(u.id));

    let resultUser = await testUtils.login('moderator', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const reqParams = { type: 'bulk-update-check', resource: 'users', ids: [0, ...allUserIds] };
    const result = await testUtils.post('search', token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of objects
    expect(result.data.data.length).toBe(1);

    // Response's data object has correct type
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'bulk-update-check',
      })
    );

    // Response contains correct amount of updateResources and deletedIds
    expect(result.data.data[0].attributes.updatedResources.length).toBe(2);
    expect(result.data.data[0].attributes.deletedIds.length).toBe(1);
  });

  test('bulk-update-check for users with admin privilege', async () => {
    let resultAdmin = await testUtils.login('admin', 'password');
    const allUsers = await testUtils.get('users', '', resultAdmin.data.data[0].attributes.token);
    const allUserIds = allUsers.data.data.map((u) => Number(u.id));

    let resultUser = await testUtils.login('admin', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const reqParams = { type: 'bulk-update-check', resource: 'users', ids: [0, ...allUserIds] };
    const result = await testUtils.post('search', token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of objects
    expect(result.data.data.length).toBe(1);

    // Response's data object has correct type
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'bulk-update-check',
      })
    );

    // Response contains correct amount of updateResources and deletedIds
    expect(result.data.data[0].attributes.updatedResources.length).toBe(allUserIds.length);
    expect(result.data.data[0].attributes.deletedIds.length).toBe(1);
  });

  test('bulk-update-check for tasks', async () => {
    let resultAdmin = await testUtils.login('admin', 'password');
    const allTasks = await testUtils.get('tasks', '', resultAdmin.data.data[0].attributes.token);
    const allTaskIds = allTasks.data.data.map((u) => Number(u.id));

    let resultUser = await testUtils.login('admin', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const reqParams = { type: 'bulk-update-check', resource: 'tasks', ids: [0, ...allTaskIds] };
    const result = await testUtils.post('search', token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of objects
    expect(result.data.data.length).toBe(1);

    // Response's data object has correct type
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'bulk-update-check',
      })
    );

    // Response contains correct amount of updateResources and deletedIds
    expect(result.data.data[0].attributes.updatedResources.length).toBe(allTaskIds.length);
    expect(result.data.data[0].attributes.deletedIds.length).toBe(1);
  });

  test('bulk-update-check for holons', async () => {
    let resultAdmin = await testUtils.login('admin', 'password');
    const allHolons = await testUtils.get('holons', '', resultAdmin.data.data[0].attributes.token);
    const allHolonIds = allHolons.data.data.map((u) => Number(u.id));

    let resultUser = await testUtils.login('admin', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const reqParams = { type: 'bulk-update-check', resource: 'holons', ids: [0, ...allHolonIds] };
    const result = await testUtils.post('search', token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of objects
    expect(result.data.data.length).toBe(1);

    // Response's data object has correct type
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'bulk-update-check',
      })
    );

    // Response contains correct amount of updateResources and deletedIds
    expect(result.data.data[0].attributes.updatedResources.length).toBe(allHolonIds.length);
    expect(result.data.data[0].attributes.deletedIds.length).toBe(1);
  });

  test('bulk-update-check for allocations', async () => {
    let resultAdmin = await testUtils.login('admin', 'password');
    const allAllocations = await testUtils.get('allocations', '', resultAdmin.data.data[0].attributes.token);
    const allAllocationIds = allAllocations.data.data.map((u) => Number(u.id));

    let resultUser = await testUtils.login('admin', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const reqParams = { type: 'bulk-update-check', resource: 'allocations', ids: [0, ...allAllocationIds] };
    const result = await testUtils.post('search', token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of objects
    expect(result.data.data.length).toBe(1);

    // Response's data object has correct type
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'bulk-update-check',
      })
    );

    // Response contains correct amount of updateResources and deletedIds
    expect(result.data.data[0].attributes.updatedResources.length).toBe(allAllocationIds.length);
    expect(result.data.data[0].attributes.deletedIds.length).toBe(1);
  });

  test('bulk-update-check for users with past and future latest_time timestamps', async () => {
    const pastTime = new Date('2021-07-05T13:01:21.975Z');
    const futureTime = new Date('2029-07-05T13:01:21.975Z');

    let resultAdmin = await testUtils.login('admin', 'password');
    const allUsers = await testUtils.get('users', '', resultAdmin.data.data[0].attributes.token);
    const allUserIds = allUsers.data.data.map((u) => Number(u.id));

    let resultUser = await testUtils.login('admin', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const reqParams1 = { type: 'bulk-update-check', resource: 'users', ids: [0, ...allUserIds], latest_update: pastTime };
    const result1 = await testUtils.post('search', token, reqParams1);
    const reqParams2 = { type: 'bulk-update-check', resource: 'users', ids: [0, ...allUserIds], latest_update: futureTime };
    const result2 = await testUtils.post('search', token, reqParams2);

    // Response has correct link
    expect(result1.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );
    expect(result2.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );

    // Response has no errors
    expect(result1.data.errors.length).toBe(0);
    expect(result2.data.errors.length).toBe(0);

    // Response contains correct amount of objects
    expect(result1.data.data.length).toBe(1);
    expect(result2.data.data.length).toBe(1);

    // Response's data object has correct type
    expect(result1.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'bulk-update-check',
      })
    );
    expect(result2.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'bulk-update-check',
      })
    );

    // Response contains correct amount of updateResources and deletedIds
    expect(result1.data.data[0].attributes.updatedResources.length).toBe(allUserIds.length);
    expect(result1.data.data[0].attributes.deletedIds.length).toBe(1);
    expect(result2.data.data[0].attributes.updatedResources.length).toBe(0);
    expect(result2.data.data[0].attributes.deletedIds.length).toBe(1);
  });

  test('bulk-update-check for tasks with past and future latest_time timestamps', async () => {
    const pastTime = new Date('2021-07-05T13:01:21.975Z');
    const futureTime = new Date('2029-07-05T13:01:21.975Z');

    let resultAdmin = await testUtils.login('admin', 'password');
    const allTasks = await testUtils.get('tasks', '', resultAdmin.data.data[0].attributes.token);
    const allTaskIds = allTasks.data.data.map((u) => Number(u.id));

    let resultUser = await testUtils.login('admin', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const reqParams1 = { type: 'bulk-update-check', resource: 'tasks', ids: [0, ...allTaskIds], latest_update: pastTime };
    const result1 = await testUtils.post('search', token, reqParams1);
    const reqParams2 = { type: 'bulk-update-check', resource: 'tasks', ids: [0, ...allTaskIds], latest_update: futureTime };
    const result2 = await testUtils.post('search', token, reqParams2);

    // Response has correct link
    expect(result1.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );
    expect(result2.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );

    // Response has no errors
    expect(result1.data.errors.length).toBe(0);
    expect(result2.data.errors.length).toBe(0);

    // Response contains correct amount of objects
    expect(result1.data.data.length).toBe(1);
    expect(result2.data.data.length).toBe(1);

    // Response's data object has correct type
    expect(result1.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'bulk-update-check',
      })
    );
    expect(result2.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'bulk-update-check',
      })
    );

    // Response contains correct amount of updateResources and deletedIds
    expect(result1.data.data[0].attributes.updatedResources.length).toBe(allTaskIds.length);
    expect(result1.data.data[0].attributes.deletedIds.length).toBe(1);
    expect(result2.data.data[0].attributes.updatedResources.length).toBe(0);
    expect(result2.data.data[0].attributes.deletedIds.length).toBe(1);
  });

  test('bulk-update-check for holons with past and future latest_time timestamps', async () => {
    const pastTime = new Date('2021-07-05T13:01:21.975Z');
    const futureTime = new Date('2029-07-05T13:01:21.975Z');

    let resultAdmin = await testUtils.login('admin', 'password');
    const allHolons = await testUtils.get('holons', '', resultAdmin.data.data[0].attributes.token);
    const allHolonIds = allHolons.data.data.map((u) => Number(u.id));

    await testUtils.wait(60);
    let resultUser = await testUtils.login('admin', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const reqParams1 = { type: 'bulk-update-check', resource: 'holons', ids: [0, ...allHolonIds], latest_update: pastTime };
    const result1 = await testUtils.post('search', token, reqParams1);
    const reqParams2 = { type: 'bulk-update-check', resource: 'holons', ids: [0, ...allHolonIds], latest_update: futureTime };
    const result2 = await testUtils.post('search', token, reqParams2);

    // Response has correct link
    expect(result1.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );
    expect(result2.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );

    // Response has no errors
    expect(result1.data.errors.length).toBe(0);
    expect(result2.data.errors.length).toBe(0);

    // Response contains correct amount of objects
    expect(result1.data.data.length).toBe(1);
    expect(result2.data.data.length).toBe(1);

    // Response's data object has correct type
    expect(result1.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'bulk-update-check',
      })
    );
    expect(result2.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'bulk-update-check',
      })
    );

    // Response contains correct amount of updateResources and deletedIds
    expect(result1.data.data[0].attributes.updatedResources.length).toBe(allHolonIds.length);
    expect(result1.data.data[0].attributes.deletedIds.length).toBe(1);
    expect(result2.data.data[0].attributes.updatedResources.length).toBe(0);
    expect(result2.data.data[0].attributes.deletedIds.length).toBe(1);
  });

  test('bulk-update-check for allocations with past and future latest_time timestamps', async () => {
    const pastTime = new Date('2021-07-05T13:01:21.975Z');
    const futureTime = new Date('2029-07-05T13:01:21.975Z');

    let resultAdmin = await testUtils.login('admin', 'password');
    const allAllocations = await testUtils.get('allocations', '', resultAdmin.data.data[0].attributes.token);
    const allAllocationIds = allAllocations.data.data.map((u) => Number(u.id));

    let resultUser = await testUtils.login('admin', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const reqParams1 = { type: 'bulk-update-check', resource: 'allocations', ids: [0, ...allAllocationIds], latest_update: pastTime };
    const result1 = await testUtils.post('search', token, reqParams1);
    const reqParams2 = { type: 'bulk-update-check', resource: 'allocations', ids: [0, ...allAllocationIds], latest_update: futureTime };
    const result2 = await testUtils.post('search', token, reqParams2);

    // Response has correct link
    expect(result1.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );
    expect(result2.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );

    // Response has no errors
    expect(result1.data.errors.length).toBe(0);
    expect(result2.data.errors.length).toBe(0);

    // Response contains correct amount of objects
    expect(result1.data.data.length).toBe(1);
    expect(result2.data.data.length).toBe(1);

    // Response's data object has correct type
    expect(result1.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'bulk-update-check',
      })
    );
    expect(result2.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'bulk-update-check',
      })
    );

    // Response contains correct amount of updateResources and deletedIds
    expect(result1.data.data[0].attributes.updatedResources.length).toBe(allAllocationIds.length);
    expect(result1.data.data[0].attributes.deletedIds.length).toBe(1);
    expect(result2.data.data[0].attributes.updatedResources.length).toBe(0);
    expect(result2.data.data[0].attributes.deletedIds.length).toBe(1);
  });

  test("bulk-search with invalid parameter name", async () => {
    let resultAdmin = await testUtils.login('admin', 'password');
    const allUsers = await testUtils.get('users', '', resultAdmin.data.data[0].attributes.token);
    const allUserIds = allUsers.data.data.map((u) => Number(u.id));

    let resultUser = await testUtils.login('user', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const reqParams = { tyspe: 'bulk-search', resource: 'users', ids: [0, ...allUserIds] };
    let result = await testUtils.post('search', token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );

    // Response has error
    expect(result.data.errors.length).toBe(1);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(0);

    // Response has correct error
    expect(result.data.errors[0].title).toBe("MISSING OR INVALID PARAMETERS");
  });

  test("bulk-search with invalid parameter value", async () => {
    let resultAdmin = await testUtils.login('admin', 'password');
    const allUsers = await testUtils.get('users', '', resultAdmin.data.data[0].attributes.token);
    const allUserIds = allUsers.data.data.map((u) => Number(u.id));

    let resultUser = await testUtils.login('user', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const reqParams = { type: 'bulk-searchj', resource: 'users', ids: [0, ...allUserIds] };
    let result = await testUtils.post('search', token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );

    // Response has error
    expect(result.data.errors.length).toBe(1);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(0);

    // Response has correct error
    expect(result.data.errors[0].title).toBe("INVALID PARAMETER VALUES");
  });

  test("bulk-search with invalid parameter value", async () => {
    let resultAdmin = await testUtils.login('admin', 'password');
    const allUsers = await testUtils.get('users', '', resultAdmin.data.data[0].attributes.token);
    const allUserIds = allUsers.data.data.map((u) => Number(u.id));

    let resultUser = await testUtils.login('user', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const reqParams = { type: 'bulk-search', resource: 'users', ids: ["0SS", ...allUserIds] };
    let result = await testUtils.post('search', token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );

    // Response has error
    expect(result.data.errors.length).toBe(1);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(0);

    // Response has correct error
    expect(result.data.errors[0].title).toBe("INVALID PARAMETER VALUES");
  });

  test("bulk-update-check with invalid parameter name", async () => {
    let resultAdmin = await testUtils.login('admin', 'password');
    const allUsers = await testUtils.get('users', '', resultAdmin.data.data[0].attributes.token);
    const allUserIds = allUsers.data.data.map((u) => Number(u.id));

    let resultUser = await testUtils.login('user', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const reqParams = { type: 'bulk-update-check', resource: 'users', ids: [0, ...allUserIds], a:"a" };
    let result = await testUtils.post('search', token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );

    // Response has error
    expect(result.data.errors.length).toBe(1);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(0);

    // Response has correct error
    expect(result.data.errors[0].title).toBe("INVALID PARAMETER NAMES");
  });

  test("bulk-update-check with invalid parameter value", async () => {
    let resultAdmin = await testUtils.login('admin', 'password');
    const allUsers = await testUtils.get('users', '', resultAdmin.data.data[0].attributes.token);
    const allUserIds = allUsers.data.data.map((u) => Number(u.id));

    let resultUser = await testUtils.login('user', 'password');
    const token = resultUser.data.data[0].attributes.token;
    const reqParams = { type: 'bulk-update-check', resource: 'userss', ids: [0, ...allUserIds] };
    let result = await testUtils.post('search', token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/search') }),
      })
    );

    // Response has error
    expect(result.data.errors.length).toBe(1);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(0);

    // Response has correct error
    expect(result.data.errors[0].title).toBe("INVALID PARAMETER VALUES");
  });
});
