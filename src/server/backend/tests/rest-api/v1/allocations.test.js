import * as app from '../../../app';
import * as testUtils from '../../utils/utils';
import * as db from '../../../relational-database-api/database';
import * as testEnvironment from '../../utils/test-environment';

// Configuring test environment
jest.useRealTimers();
jest.setTimeout(40000);

beforeAll(async () => {
  // Waiting server to start
  await testUtils.wait(5);

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

describe('testing GET /allocations endpoint with queries', () => {
  test('get all allocations', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('allocations', '', token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/allocations') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(2);

    // Response's data object has correct type
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'allocations',
      })
    );

    // Response has correct resources
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        created_on: '2022-06-10T18:24:21.381Z',
      })
    );
    expect(result.data.data[1].attributes).toEqual(
      expect.objectContaining({
        created_on: '2022-06-10T18:24:21.381Z',
      })
    );
  });

  test('get all allocations with the query string keys updated_on.elt and created_on.elt', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('allocations', '?updated_on.elt=' + new Date('2200-06-10T18:24:21.381Z') + '&created_on.elt=' + new Date('2200-06-10T18:24:21.381Z'), token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/allocations') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(2);

    // Response's data object has correct type
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'allocations',
      })
    );

    // Response has correct resources
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        created_on: '2022-06-10T18:24:21.381Z',
      })
    );
    expect(result.data.data[1].attributes).toEqual(
      expect.objectContaining({
        created_on: '2022-06-10T18:24:21.381Z',
      })
    );
  });

  test('get allocation with the query string key id', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('allocations', '', token);
    const randomAllocationId = result.data.data[0].attributes.id;
    result = await testUtils.get('allocations', '?id=' + randomAllocationId, token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/allocations') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(1);

    // Response's data object has correct type
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'allocations',
      })
    );

    // Response has correct resources
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        created_on: '2022-06-10T18:24:21.381Z',
      })
    );
  });

  test('get allocation with all query string keys: id, updated_on, created_on, completed_on.egt, request_by, start_time.e, end_time.elt', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get(
      'allocations',
      '?updated_on.elt=' +
        new Date('2200-06-10T18:24:21.381Z') +
        '&created_on.elt=' +
        new Date('2200-06-10T18:24:21.381Z') +
        '&id=2&completed_on.egt=2200-06-10T18:24:21.381Z&request_by=12313&start_time.e=2200-06-10T18:24:21.381Z&end_time.elt=2200-06-10T18:24:21.381Z',
      token
    );

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/allocations') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(0);
  });

  test('get allocation with invalid query string key', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('allocations', '?updatesd_on.elt=' + new Date('2200-06-10T18:24:21.381Z') + '&created_on.elt=' + new Date('2200-06-10T18:24:21.381Z'), token);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/allocations') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(1);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(0);

    // Response has correct errpr
    expect(result.data.errors[0].title).toBe('INVALID QUERY STRING KEY');
  });

  test('get allocation with invalid query string value', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('allocations', '?updated_on.elt=' + 'ADADADA' + '&created_on.elt=' + new Date('2200-06-10T18:24:21.381Z'), token);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/allocations') }),
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

describe('testing POST /allocations endpoint with parameters', () => {
  test('post allocation with required parameters: request', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    const reqParams = { request: JSON.stringify({ algorithm: 'FindOptimal', taskIds: [1, 2, 3], holonIds: [1, 2, 3] }) };
    result = await testUtils.post('allocations/', token, reqParams);
    result = result.data || result.response.data;

    // Response has correct link
    expect(result).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/allocations') }),
      })
    );

    // Response has no errors
    expect(result.errors.length).toBe(0);

    // Response contains correct amount of data objects
    expect(result.data.length).toBe(1);

    // Response's data object is type of holons
    expect(result.data[0]).toEqual(
      expect.objectContaining({
        type: 'allocations',
      })
    );

    // Response has correct resource
    expect(result.data[0].attributes.request).not.toBe(null);
  });

  test('post allocation with no parameters', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    const reqParams = {};
    result = await testUtils.post('allocations/', token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/allocations') }),
      })
    );

    // Response has correct amount of errors
    expect(result.data.errors.length).toBe(1);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(0);

    // Response has correct error title
    expect(result.data.errors[0].title).toBe('MISSING OR INVALID PARAMETERS');
  });

  test('post allocation with invalid parameter name', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    const reqParams = { adad: 'a', request: JSON.stringify({}) };
    result = await testUtils.post('allocations/', token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/allocations') }),
      })
    );

    // Response has correct amount of errors
    expect(result.data.errors.length).toBe(1);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(0);

    // Response has correct error title
    expect(result.data.errors[0].title).toBe('INVALID PARAMETER NAMES');
  });

  test('post allocation with invalid parameter value', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    const reqParams = { request: JSON.stringify({ ss: 'a' }) };
    result = await testUtils.post('allocations/', token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/allocations') }),
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

describe('testing PATCH /allocations endpoint with parameters', () => {
  test('patch allocation with all parameters: start_time, end_time, result, completed_on, reallocate', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('allocations', '', token);

    const randomAllocationId = result.data.data[0].attributes.id;
    const reqParams = {
      start_time: new Date(),
      end_time: new Date(),
      completed_on: new Date(),
      reallocate: false,
      result: JSON.stringify({ allocations: [{ taskId: 222, holonIds: [1, 2, 3] }] }),
    };
    result = await testUtils.patch('allocations/' + randomAllocationId, token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/allocations') }),
      })
    );

    // Response has correct amount of errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of allocations
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'allocations',
      })
    );

    // Response has correct allocation
    expect(result.data.data[0].attributes.start_time).not.toBe(null);
    expect(result.data.data[0].attributes.end_time).not.toBe(null);
    expect(result.data.data[0].attributes.completed_on).not.toBe(null);
    expect(result.data.data[0].attributes.reallocate).toBe(false);
    expect(JSON.parse(result.data.data[0].attributes.result).allocations[0].taskId).toBe(222);
    expect(JSON.parse(result.data.data[0].attributes.result).allocations[0].holonIds.length).toBe(3);
  });

  test('patch allocation with no parameters', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('allocations', '', token);

    const randomAllocationId = result.data.data[0].attributes.id;
    const reqParams = {};
    result = await testUtils.patch('allocations/' + randomAllocationId, token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/allocations') }),
      })
    );

    // Response has correct amount of errors
    expect(result.data.errors.length).toBe(1);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(0);

    // Response has correct error title
    expect(result.data.errors[0].title).toBe('MISSING OR INVALID PARAMETERS');
  });

  test('patch allocation with invalid parameter name', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('allocations', '', token);

    const randomAllocationId = result.data.data[0].attributes.id;
    const reqParams = { start_time: new Date(), jsjs: 'a' };
    result = await testUtils.patch('allocations/' + randomAllocationId, token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/allocations') }),
      })
    );

    // Response has correct amount of errors
    expect(result.data.errors.length).toBe(1);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(0);

    // Response has correct error title
    expect(result.data.errors[0].title).toBe('INVALID PARAMETER NAMES');
  });

  test('patch allocation with invalid parameter value', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('allocations', '', token);

    const randomAllocationId = result.data.data[0].attributes.id;
    const reqParams = { start_time: 'sda' };
    result = await testUtils.patch('allocations/' + randomAllocationId, token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/allocations') }),
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

describe('testing DELETE /allocations endpoint', () => {
  test('delete allocation', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('allocations', '', token);

    const randomAllocationId = result.data.data[0].attributes.id;
    result = await testUtils.del('allocations/' + randomAllocationId, token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/allocations') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of allocations
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'allocations',
      })
    );

    // Response has correct allocation
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        id: randomAllocationId,
      })
    );
  });

  test('delete non-exist allocation', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.del('allocations/0', token);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/allocations') }),
      })
    );

    // Response has an error
    expect(result.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.data.data.length).toBe(0);

    // Response has correct error
    expect(result.data.errors[0].title).toBe('ALLOCATION NOT FOUND');
  });
});

describe('testing POST /allocations/:id/complete-requests endpoint', () => {
  test('completing an allocation with result which contains error message', async () => {
    // Set up test environment again
    await testEnvironment.addTestEnvironment(db);
    // Choose a random allocation id
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('allocations', '', token);
    const randomAllocationId = result.data.data[0].attributes.id;

    // Create a random result and assing it to the random allocation
    const reqParams = {
      start_time: new Date(),
      end_time: new Date(),
      completed_on: new Date(),
      reallocate: false,
      result: JSON.stringify({
        error: 'Error message',
      }),
    };
    let allocationUpdateResult = await testUtils.patch('allocations/' + randomAllocationId, token, reqParams);
    allocationUpdateResult = allocationUpdateResult.data || allocationUpdateResult.response.data;
    expect(allocationUpdateResult.errors.length).toBe(0);

    // Attempt to complete the allocation
    let allocationCompleteRequest = await testUtils.post('allocations/' + randomAllocationId + '/complete-requests', token);
    allocationCompleteRequest = allocationCompleteRequest.data || allocationCompleteRequest.response.data;

    // Responses have corrent JSON:API link
    expect(allocationCompleteRequest).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/allocations') }),
      })
    );

    expect(allocationCompleteRequest.errors[0].title).toBe('NO ALLOCABLE RESULT');
  });

  test('completing an allocation with result which contains invalid task id', async () => {
    // Set up test environment again
    await testEnvironment.addTestEnvironment(db);
    // Choose a random allocation id
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('allocations', '', token);
    const randomAllocationId = result.data.data[0].attributes.id;

    // Create a random result and assing it to the random allocation
    const reqParams = {
      start_time: new Date(),
      end_time: new Date(),
      completed_on: new Date(),
      reallocate: false,
      result: JSON.stringify({
        allocations: [{ taskId: 11, holonIds: [] }],
      }),
    };
    let allocationUpdateResult = await testUtils.patch('allocations/' + randomAllocationId, token, reqParams);
    allocationUpdateResult = allocationUpdateResult.data || allocationUpdateResult.response.data;
    expect(allocationUpdateResult.errors.length).toBe(0);

    // Attempt to complete the allocation
    let allocationCompleteRequest = await testUtils.post('allocations/' + randomAllocationId + '/complete-requests', token);
    allocationCompleteRequest = allocationCompleteRequest.data || allocationCompleteRequest.response.data;

    // Responses have corrent JSON:API link
    expect(allocationCompleteRequest).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/allocations') }),
      })
    );

    expect(allocationCompleteRequest.errors[0].title).toBe('NO ALLOCABLE RESULT');
  });

  test('completing an allocation with result which contains correct result', async () => {
    // Set up test environment again
    await testEnvironment.addTestEnvironment(db);
    // Choose a random allocation id
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('allocations', '', token);
    const randomAllocationId = result.data.data[0].attributes.id;

    // Get all tasks
    let taskResults = await testUtils.get('tasks', '', token);
    taskResults = taskResults.data || taskResults.response.data;
    expect(taskResults.errors.length).toBe(0);
    expect(taskResults.data.length > 0).toBe(true);
    let taskIds = taskResults.data.map((data) => data.attributes.id);

    // Get all holons
    let holonResults = await testUtils.get('holons', '', token);
    holonResults = holonResults.data || holonResults.response.data;
    expect(holonResults.errors.length).toBe(0);
    expect(holonResults.data.length > 0).toBe(true);
    let holonIds = holonResults.data.map((data) => data.attributes.id);

    // Generate random allocations
    const allocations = [];
    taskIds.forEach((taskId) => {
      allocations.push({ taskId, holonIds: [holonIds.pop(), holonIds.pop()] });
    });

    // Create a random result and assing it to the random allocation
    const reqParams = {
      start_time: new Date(),
      end_time: new Date(),
      completed_on: new Date(),
      reallocate: false,
      result: JSON.stringify({
        allocations,
      }),
    };
    let allocationUpdateResult = await testUtils.patch('allocations/' + randomAllocationId, token, reqParams);
    allocationUpdateResult = allocationUpdateResult.data || allocationUpdateResult.response.data;
    expect(allocationUpdateResult.errors.length).toBe(0);

    // Attempt to complete the allocation
    let allocationCompleteRequest = await testUtils.post('allocations/' + randomAllocationId + '/complete-requests', token);
    allocationCompleteRequest = allocationCompleteRequest.data || allocationCompleteRequest.response.data;

    // Responses have corrent JSON:API link
    expect(allocationCompleteRequest).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/allocations') }),
      })
    );

    expect(allocationCompleteRequest.errors.length).toBe(0);
    expect(testUtils.isDate(new Date(allocationCompleteRequest.data[0].attributes.completed_on))).toBe(true);

    // Get all tasks
    taskResults = await testUtils.get('tasks', '', token);
    taskResults = taskResults.data || taskResults.response.data;
    expect(taskResults.errors.length).toBe(0);
    expect(taskResults.data.length > 0).toBe(true);
    taskIds = taskResults.data.map((data) => data.attributes.id);

    // Get all holons
    holonResults = await testUtils.get('holons', '', token);
    holonResults = holonResults.data || holonResults.response.data;
    expect(holonResults.errors.length).toBe(0);
    expect(holonResults.data.length > 0).toBe(true);
    holonIds = holonResults.data.map((data) => data.attributes.id);

    // Get rid of undefined holon IDs
    allocations.forEach((allocation) => {
      allocation.holonIds = allocation.holonIds.filter((i) => typeof i === 'number');
    });

    // Check the tasks are updated
    allocations.forEach((allocation) => {
      expect(taskIds.includes(allocation.taskId)).toBe(true);
      const task = taskResults.data.filter((data) => data.attributes.id === allocation.taskId)[0].attributes;
      JSON.parse(task.assigned_to).ids.forEach((id) => {
        expect(allocation.holonIds.includes(id));
      });
      allocation.holonIds.forEach((holonId) => {
        const holon = ((holonResults.data.filter(i => i.attributes.id === holonId))[0]).attributes;
        expect(JSON.parse(holon.availability_data).currentValue).toBe(1);
      });
    });
  });
});

describe('testing POST /allocations/:id/reallocate-requests endpoint', () => {
  test('reallocate', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('allocations', '', token);
    const randomAllocationId = result.data.data[0].attributes.id;

    // Set reallocate to false
    const reqParams = {
      reallocate: false,
    };
    result = await testUtils.patch('allocations/' + randomAllocationId, token, reqParams);
    expect(result.data.data[0].attributes.reallocate).toBe(false);

    // Send a reallocate request
    result = await testUtils.post('allocations/' + randomAllocationId + '/reallocate-requests', token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/allocations') }),
      })
    );

    // Response has correct amount of errors
    expect(result.data.errors.length).toBe(0);

    // Response contains correct amount of data objects
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of allocations
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'allocations',
      })
    );

    // Response has correct allocation
    expect(result.data.data[0].attributes.reallocate).toBe(true);
  });
});

describe("", () => {

});
