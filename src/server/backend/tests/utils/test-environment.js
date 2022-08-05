import * as testUtils from './utils';
import * as restUtils from '../../rest-api/v1/utils/utils';

export const addTestEnvironment = async (db) => {
  // Empty all tables
  let responseAlg = await db.executeQuery('TRUNCATE algorithms CASCADE');
  let responseAll = await db.executeQuery('TRUNCATE allocations CASCADE');
  let responseDas = await db.executeQuery('TRUNCATE dashboard_settings CASCADE');
  let responseTas = await db.executeQuery('TRUNCATE tasks CASCADE');
  let responseUse = await db.executeQuery('TRUNCATE users CASCADE');
  let responseHol = await db.executeQuery('TRUNCATE holons CASCADE');

  // CREATE USERS
  // Add four test users with roles of user, admin, moderator and app
  let responseApp = await db.executeQuery(
    'INSERT INTO users (role, username, password, email, firstname, lastname, created_on, updated_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    ['app', 'app', await restUtils.encryptPassword('password'), 'app@demo.com', 'demo', 'demo', new Date('2022-06-10T18:24:21.381Z'), new Date('2022-06-10T18:24:21.381Z')]
  );
  let responseUser = await db.executeQuery(
    'INSERT INTO users (role, username, password, email, firstname, lastname, created_on, updated_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    ['user', 'user', await restUtils.encryptPassword('password'), 'user@demo.com', 'demo', 'demo', new Date('2022-06-10T18:24:21.381Z'), new Date('2022-06-10T18:24:21.381Z')]
  );
  let responseModerator = await db.executeQuery(
    'INSERT INTO users (role, username, password, email, firstname, lastname, created_on, updated_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [
      'moderator',
      'moderator',
      await restUtils.encryptPassword('password'),
      'moderator@demo.com',
      'demo',
      'demo',
      new Date('2022-06-10T18:24:21.381Z'),
      new Date('2022-06-10T18:24:21.381Z'),
    ]
  );
  let responseAdmin = await db.executeQuery(
    'INSERT INTO users (role, username, password, email, firstname, lastname, created_on, updated_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    ['admin', 'admin', await restUtils.encryptPassword('password'), 'admin@demo.com', 'demo', 'demo', new Date('2022-06-10T18:24:21.381Z'), new Date('2022-06-10T18:24:21.381Z')]
  );

  // CREATE HOLONS
  // Template for availability_data, load_data, stress_data and cost_data
  const emptyDataTemplate = JSON.stringify({ currentValue: 0, latestUpdate: new Date(), records: [] });

  let responseHolon1 = await db.executeQuery(
    'INSERT INTO holons (type, name, gender, daily_work_hours, latest_state, availability_data, load_data, stress_data, cost_data, age, experience_years, created_by, created_on, updated_on) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
    [
      'employee',
      'demoholon1',
      'man',
      8,
      '{}',
      emptyDataTemplate,
      emptyDataTemplate,
      emptyDataTemplate,
      emptyDataTemplate,
      25,
      8,
      responseUser.results[0].id,
      new Date(),
      new Date(),
    ]
  );

  let responseHolon2 = await db.executeQuery(
    'INSERT INTO holons (type, name, gender, daily_work_hours, latest_state, availability_data, load_data, stress_data, cost_data, age, experience_years, created_by, created_on, updated_on) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
    [
      'employee',
      'demoholon2',
      'man',
      8,
      '{}',
      emptyDataTemplate,
      emptyDataTemplate,
      emptyDataTemplate,
      emptyDataTemplate,
      29,
      11,
      responseModerator.results[0].id,
      new Date(),
      new Date(),
    ]
  );

  let responseHolon3 = await db.executeQuery(
    'INSERT INTO holons (type, name, gender, daily_work_hours, latest_state, availability_data, load_data, stress_data, cost_data, age, experience_years, created_by, created_on, updated_on) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
    [
      'employee',
      'demoholon3',
      'man',
      8,
      '{}',
      emptyDataTemplate,
      emptyDataTemplate,
      emptyDataTemplate,
      emptyDataTemplate,
      38,
      13,
      responseAdmin.results[0].id,
      new Date(),
      new Date(),
    ]
  );

  // CREATE TASKS
  const knowledgeTags = JSON.stringify({ tags: ['sql'] });
  const resourceDemand = JSON.stringify({ demands: [['ordinary', 5, ['sql']]] });
  const assignedTo = JSON.stringify({ ids: [] });

  let responseTask1 = await db.executeQuery(
    'INSERT INTO tasks (assigned_to, type, name, description, estimated_time, knowledge_tags, resource_demand, priority, created_by, created_on, updated_on) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
    [assignedTo, 'ordinary', 'demotask1', 'This is a task', 8, knowledgeTags, resourceDemand, 4, responseUser.results[0].id, new Date(), new Date()]
  );

  let responseTask2 = await db.executeQuery(
    'INSERT INTO tasks (assigned_to, type, name, description, estimated_time, knowledge_tags, resource_demand, priority, created_by, created_on, updated_on) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
    [assignedTo, 'ordinary', 'demotask2', 'This is a task', 8, knowledgeTags, resourceDemand, 4, responseModerator.results[0].id, new Date(), new Date()]
  );

  let responseTask3 = await db.executeQuery(
    'INSERT INTO tasks (assigned_to, type, name, description, estimated_time, knowledge_tags, resource_demand, priority, created_by, created_on, updated_on) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
    [assignedTo, 'ordinary1', 'demotask3', 'This is a task', 8, knowledgeTags, resourceDemand, 4, responseAdmin.results[0].id, new Date(), new Date()]
  );

  // CREATE SETTINGS
  const settingsTemplate = JSON.stringify({ holonsUpdate: 5, tasksUpdate: 5 });

  let responseSettings1 = await db.executeQuery('INSERT INTO dashboard_settings (settings, created_by, created_on, updated_on) ' + 'VALUES ($1, $2, $3, $4) RETURNING *', [
    settingsTemplate,
    responseUser.results[0].id,
    new Date(),
    new Date(),
  ]);

  let responseSettings2 = await db.executeQuery('INSERT INTO dashboard_settings (settings, created_by, created_on, updated_on) ' + 'VALUES ($1, $2, $3, $4) RETURNING *', [
    settingsTemplate,
    responseModerator.results[0].id,
    new Date(),
    new Date(),
  ]);

  let responseSettings3 = await db.executeQuery('INSERT INTO dashboard_settings (settings, created_by, created_on, updated_on) ' + 'VALUES ($1, $2, $3, $4) RETURNING *', [
    settingsTemplate,
    responseAdmin.results[0].id,
    new Date(),
    new Date(),
  ]);

  // CREATE ALLOCATIONS
  const requestTemplate = JSON.stringify({
    holonIds: [responseHolon1.results[0].id, responseHolon2.results[0].id, responseHolon3.results[0].id],
    taskIds: [responseTask1.results[0].id, responseTask2.results[0].id, responseTask3.results[0].id],
  });

  let responseAllocation1 = await db.executeQuery('INSERT INTO allocations (request, created_on, start_time, updated_on, request_by) ' + 'VALUES ($1, $2, $3, $4, $5)', [
    requestTemplate,
    new Date('2022-06-10T18:24:21.381Z'),
    new Date(),
    new Date(),
    responseAdmin.results[0].id
  ]);

  let responseAllocation2 = await db.executeQuery('INSERT INTO allocations (request, created_on, updated_on, request_by) ' + 'VALUES ($1, $2, $3, $4)', [
    requestTemplate,
    new Date('2022-06-10T18:24:21.381Z'),
    new Date(),
    responseAdmin.results[0].id
  ]);

  // CREATE ALGORITHMS
  let responseAlgorithm = await db.executeQuery('INSERT INTO algorithms (type, name, description, created_on, updated_on, created_by) ' + 'VALUES ($1, $2, $3, $4, $5, $6)', [
    "general",
    "AlgorithmName",
    "AlgorithmDescription",
    new Date(),
    new Date(),
    responseAdmin.results[0].id
  ]);

  let responseAlgorithm2 = await db.executeQuery('INSERT INTO algorithms (type, name, description, created_on, updated_on, created_by) ' + 'VALUES ($1, $2, $3, $4, $5, $6)', [
    "general2",
    "AlgorithmName2",
    "AlgorithmDescription2",
    new Date(),
    new Date(),
    responseAdmin.results[0].id
  ]);

  let allResponseErrors = responseAlg.errors
    .concat(responseAll.errors)
    .concat(responseDas.errors)
    .concat(responseHol.errors)
    .concat(responseTas.errors)
    .concat(responseUse.errors)
    .concat(responseUser.errors)
    .concat(responseModerator.errors)
    .concat(responseAdmin.errors)
    .concat(responseHolon1.errors)
    .concat(responseHolon2.errors)
    .concat(responseHolon3.errors)
    .concat(responseTask1.errors)
    .concat(responseTask2.errors)
    .concat(responseTask3.errors)
    .concat(responseSettings1.errors)
    .concat(responseSettings2.errors)
    .concat(responseSettings3.errors)
    .concat(responseAllocation1.errors)
    .concat(responseAllocation2.errors)
    .concat(responseApp.errors)
    .concat(responseAlgorithm.errors)
    .concat(responseAlgorithm2.errors);

  if (allResponseErrors.length > 0) throw new Error('Initialization of test environment failed');
};
