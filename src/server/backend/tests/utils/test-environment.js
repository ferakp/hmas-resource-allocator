import * as testUtils from './utils';
import * as restUtils from '../../rest-api/v1/utils/utils';

export const addTestEnvironment = async (db) => {
  // Empty all tables
  let responseAlg = await db.executeQuery('TRUNCATE algorithms CASCADE');
  let responseAll = await db.executeQuery('TRUNCATE allocations CASCADE');
  let responseDas = await db.executeQuery('TRUNCATE dashboard_settings CASCADE');
  let responseHol = await db.executeQuery('TRUNCATE holons CASCADE');
  let responseTas = await db.executeQuery('TRUNCATE tasks CASCADE');
  let responseUse = await db.executeQuery('TRUNCATE users CASCADE');

  // USERS
  // Add three test users with roles of user, admin and moderator
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
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
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
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
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
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
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

  let responseTask1 = await db.executeQuery(
    'INSERT INTO tasks (type, name, description, estimated_time, knowledge_tags, resource_demand, priority, created_by, created_on, updated_on) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
    ['ordinary', 'demotask1', 'This is a task', 8, knowledgeTags, resourceDemand, 4, responseUser.results[0].id, new Date(), new Date()]
  );

  let responseTask2 = await db.executeQuery(
    'INSERT INTO tasks (type, name, description, estimated_time, knowledge_tags, resource_demand, priority, created_by, created_on, updated_on) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
    ['ordinary', 'demotask2', 'This is a task', 8, knowledgeTags, resourceDemand, 4, responseModerator.results[0].id, new Date(), new Date()]
  );

  let responseTask3 = await db.executeQuery(
    'INSERT INTO tasks (type, name, description, estimated_time, knowledge_tags, resource_demand, priority, created_by, created_on, updated_on) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
    ['ordinary1', 'demotask3', 'This is a task', 8, knowledgeTags, resourceDemand, 4, responseAdmin.results[0].id, new Date(), new Date()]
  );

  // CREATE SETTINGS
  const settingsTemplate = JSON.stringify({ holonsUpdate: 5, tasksUpdate: 5 });

  let responseSettings1 = await db.executeQuery('INSERT INTO dashboard_settings (settings, created_by, created_on, updated_on) ' + 'VALUES ($1, $2, $3, $4)', [
    settingsTemplate,
    responseUser.results[0].id,
    new Date(),
    new Date(),
  ]);

  let responseSettings2 = await db.executeQuery('INSERT INTO dashboard_settings (settings, created_by, created_on, updated_on) ' + 'VALUES ($1, $2, $3, $4)', [
    settingsTemplate,
    responseModerator.results[0].id,
    new Date(),
    new Date(),
  ]);

  let responseSettings3 = await db.executeQuery('INSERT INTO dashboard_settings (settings, created_by, created_on, updated_on) ' + 'VALUES ($1, $2, $3, $4)', [
    settingsTemplate,
    responseAdmin.results[0].id,
    new Date(),
    new Date(),
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
    .concat(responseSettings3.errors);

  if (allResponseErrors.length > 0) throw new Error('Initialization of test environment failed');
};
