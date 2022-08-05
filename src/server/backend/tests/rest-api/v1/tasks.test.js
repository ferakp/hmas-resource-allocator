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

describe('testing GET /tasks endpoint with queries', () => {
  test('get all tasks', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('tasks', '', token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/tasks') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains three data objects
    expect(result.data.data.length).toBe(3);

    // Response's data object is type of tasks
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'tasks',
      })
    );

    // Response has correct tasks
    expect(result.data.data[0].attributes).toEqual(
      expect.objectContaining({
        name: 'demotask1',
      })
    );
    expect(result.data.data[1].attributes).toEqual(
      expect.objectContaining({
        name: 'demotask2',
      })
    );
    expect(result.data.data[2].attributes).toEqual(
      expect.objectContaining({
        name: 'demotask3',
      })
    );
  });

  test('get tasks that are updated before Date.NOW with type "ordinary1" and name demotask3', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('tasks', '?updated_on.elt=' + new Date() + '&type=ordinary1&name=demotask3', token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/tasks') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains three data objects
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of tasks
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'tasks',
      })
    );
  });

  test('get tasks that are updated before Date.NOW with type "ordinary1", name demotask3, estimated_time 8 and priority 4', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('tasks', '?updated_on.elt=' + new Date() + '&type=ordinary1&name=demotask3&estimated_time=8&priority.egt=4', token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/tasks') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of tasks
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'tasks',
      })
    );
  });

  test('get tasks that are updated before Date.NOW with type "ordinary1", name demotask3, estimated_time 8 and priority 4 and invalid parameter', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('tasks', '?updated_on.elt=' + new Date() + '&type=ordinary1&name=demotask3&estimated_time=8&asa=2&priority.egt=4', token);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/tasks') }),
      })
    );

    // Response has an error
    expect(result.data.errors.length).toBe(1);

    // Response contains no data objects
    expect(result.data.data.length).toBe(0);

    // Response's error has correct title
    expect(result.data.errors[0].title).toBe('INVALID QUERY STRING KEY');
  });
});

describe('testing PATCH /tasks endpoint', () => {
  test('patch the demotask1 with type, name, estimated_time and priority', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('tasks', '', token);

    const randomTaskId = result.data.data[0].attributes.id;
    const reqParams = { type: 'demotype', name: 'demoname1', priority: 5, estimated_time: 9 };
    result = await testUtils.patch('tasks/' + randomTaskId, token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/tasks') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of tasks
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'tasks',
      })
    );

    // Response has correct task
    expect(result.data.data[0].attributes.type).toBe('demotype');
    expect(result.data.data[0].attributes.name).toBe('demoname1');
    expect(result.data.data[0].attributes.priority).toBe('5');
    expect(result.data.data[0].attributes.estimated_time).toBe('9');
  });
  

  test('patch the demotask1 with type, name, is_completed, estimated_time, priority, knowledge_tags and resource_demand', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('tasks', '', token);

    const randomTaskId = result.data.data[0].attributes.id;
    const reqParams = {
      type: 'demotype',
      name: 'demoname1',
      is_completed: true,
      priority: 5,
      estimated_time: 9,
      knowledge_tags: JSON.stringify({ tags: ['sql'] }),
      resource_demand: JSON.stringify({ demands: [['type', 5, ['sql']]] }),
    };
    result = await testUtils.patch('tasks/' + randomTaskId, token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/tasks') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of tasks
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'tasks',
      })
    );

    // Response has correct task
    expect(result.data.data[0].attributes.type).toBe('demotype');
    expect(result.data.data[0].attributes.name).toBe('demoname1');
    expect(result.data.data[0].attributes.is_completed).toBe(true);
    expect(result.data.data[0].attributes.priority).toBe('5');
    expect(result.data.data[0].attributes.estimated_time).toBe('9');
    expect(JSON.parse(result.data.data[0].attributes.knowledge_tags).tags).toContain("sql");
    expect(JSON.parse(result.data.data[0].attributes.resource_demand).demands[0][0]).toBe("type");
    expect(JSON.parse(result.data.data[0].attributes.resource_demand).demands[0][1]).toBe(5);
    expect(JSON.parse(result.data.data[0].attributes.resource_demand).demands[0][2][0]).toBe("sql");
  });


  test('patch the demotask1 with type, name, estimated_time, priority and invalid parameter name', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('tasks', '', token);

    const randomTaskId = result.data.data[0].attributes.id;
    const reqParams = { type: 'demotype', name: 'demoname1', priority: 5, estimated_time: 9, ssda: 1 };
    result = await testUtils.patch('tasks/' + randomTaskId, token, reqParams);
    result = result.response; 

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/tasks') }),
      })
    );

    // Response has an error
    expect(result.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.data.data.length).toBe(0);

    // Response has correct error
    expect(result.data.errors[0].title).toBe('INVALID PARAMETER NAMES');
  });

  test('patch the demotask1 using admin user', async () => {
    let result = await testUtils.login('admin', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('tasks', '', token);

    const randomTaskId = result.data.data[0].attributes.id;
    const reqParams = { type: 'demotype', name: 'demoname1', priority: 5, estimated_time: 9};
    result = await testUtils.patch('tasks/' + randomTaskId, token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/tasks') }),
      })
    );

    // Response has no error
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of tasks
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'tasks',
      })
    );

    // Response has correct task
    expect(result.data.data[0].attributes.id).toBe(randomTaskId);
  });


  test('patch the demotask1 with type, name, estimated_time and invalid priority value', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('tasks', '', token);

    const randomTaskId = result.data.data[0].attributes.id;
    const reqParams = { type: 'demotype', name: 'demoname1', priority: "ss", estimated_time: 9 };
    result = await testUtils.patch('tasks/' + randomTaskId, token, reqParams);
    result = result.response; 

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/tasks') }),
      })
    );

    // Response has an error
    expect(result.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.data.data.length).toBe(0);

    // Response has correct error
    expect(result.data.errors[0].title).toBe('INVALID PARAMETER VALUES');
  });
});

describe('testing POST /tasks endpoint', () => {
  test('post a new task with type, name, description, estimated_time and priority', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('tasks', '', token);

    const randomTaskId = result.data.data[0].attributes.id;
    const reqParams = { type: 'demotype', name: 'demoname1', description: "This is a task", priority: 5, estimated_time: 9 };
    result = await testUtils.post('tasks/', token, reqParams);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/tasks') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response's data object is type of tasks
    expect(result.data.data[0]).toEqual(
      expect.objectContaining({
        type: 'tasks',
      })
    );

    // Response has correct task
    expect(result.data.data[0].attributes.type).toBe('demotype');
    expect(result.data.data[0].attributes.name).toBe('demoname1');
    expect(result.data.data[0].attributes.priority).toBe('5');
    expect(result.data.data[0].attributes.estimated_time).toBe('9');
    expect(result.data.data[0].attributes.description).toBe('This is a task');
    expect(result.data.data[0].attributes.created_by).not.toBeNull();
    expect(result.data.data[0].attributes.updated_on).not.toBeNull();
    expect(result.data.data[0].attributes.created_on).not.toBeNull();
  });

  test('post a new task with type, name, description, estimated_time, priority and invalid parameter name', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('tasks', '', token);

    const randomTaskId = result.data.data[0].attributes.id;
    const reqParams = { type: 'demotype', name: 'demoname1', description: "This is a task", priority: 5, estimated_time: 9, shs: 2 };
    result = await testUtils.post('tasks/', token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/tasks') }),
      })
    );

    // Response has an error
    expect(result.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.data.data.length).toBe(0);

    // Response has correct error
    expect(result.data.errors[0].title).toBe('INVALID PARAMETER NAMES');
  });

  test('post a new task with type, name, description, estimated_time invalid priority value', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('tasks', '', token);

    const randomTaskId = result.data.data[0].attributes.id;
    const reqParams = { type: 'demotype', name: 'demoname1', description: "This is a task", priority: "ss5", estimated_time: 9, };
    result = await testUtils.post('tasks/', token, reqParams);
    result = result.response;

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/tasks') }),
      })
    );

    // Response has an error
    expect(result.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.data.data.length).toBe(0);

    // Response has correct error
    expect(result.data.errors[0].title).toBe('INVALID PARAMETER VALUES');
  });
});


describe('testing DELETE /tasks endpoint', () => {

  test('delete a task as an user', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;
    result = await testUtils.get('tasks', '', token);

    const randomTaskId = result.data.data[0].attributes.id;
    result = await testUtils.del('tasks/'+randomTaskId, token);

    // Response has correct link
    expect(result.data).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/tasks') }),
      })
    );

    // Response has no errors
    expect(result.data.errors.length).toBe(0);

    // Response contains one data object
    expect(result.data.data.length).toBe(1);

    // Response has correct task
    expect(result.data.data[0].attributes.id).toBe(randomTaskId);
  });


});