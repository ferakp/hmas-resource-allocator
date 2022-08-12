import * as app from '../../app';
import * as testUtils from '../utils/utils';
import * as Algorithms from '../../algorithms/Algorithms';
import * as Logger from '../../logger/logger';

/**
 * BEFORE RUNNING THIS TEST MAKE SURE THE BACKEND (REST API), NEO4J and DATABASE (POSTGRESQL) ARE UP AND RUNNING WITH THE DEVELOPMENT NODE_ENV VARIABLES
 *
 * This test assumes the backend API (REST API) is up and running with the test environment configuration
 *
 *
 *
 *
 */

// Configuring test environment
jest.useRealTimers();
jest.setTimeout(250000);

beforeAll(async () => {
  // Shut down printer
  Logger.stopPrinting();
  // Wait till .env file is loaded
  await testUtils.wait(15);
  expect(testUtils.switchRestApiToBackend()).toBe(true);
});

afterAll(async () => {
  app.stopServer();
  testUtils.stop();
  await testUtils.wait(5);
});

describe('test application', () => {
  test('algorithm registration', async () => {
    let result = await testUtils.login('app', 'password');
    const token = result.data.data[0].attributes.token;
    let response = await testUtils.get('algorithms', '', token);
    response = response.data || response.response.data;

    // Response has correct link
    expect(response).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/algorithms') }),
      })
    );

    const localAlgorithms = Algorithms.getAlgorithms();
    const serverAlgorithms = response.data.map((i) => i.attributes);

    localAlgorithms.forEach((algorithm) => {
      let correctServerAlgorithm = serverAlgorithms.filter((i) => i.name === algorithm.name && i.description === algorithm.description && algorithm.type === i.type);
      expect(correctServerAlgorithm.length).toBe(1);
    });
  });

  test('utils library', () => {
    for (let i = 0; i < 100; i++) {
      const holon = testUtils.generateHolon();
      const task = testUtils.generateTask();

      expect(typeof task.type).toBe('string');
      expect(typeof task.name).toBe('string');
      expect(typeof task.description).toBe('string');
      expect(typeof task.estimated_time === 'number' && task.estimated_time < 1000).toBe(true);
      JSON.parse(task.knowledge_tags).tags.forEach((tag) => {
        expect(typeof tag).toBe('string');
      });
      JSON.parse(task.resource_demand).demands.forEach((demand) => {
        expect(typeof demand[0]).toBe('string');
        expect(typeof demand[1]).toBe('number');
        expect(Array.isArray(demand[2])).toBe(true);
        demand[2].forEach((i) => {
          expect(typeof i).toBe('string');
        });
      });
      expect(typeof task.priority === 'number' && task.priority >= 0 && task.priority < 6);
      expect(task.start_date instanceof Date).toBe(true);
      expect(task.due_date instanceof Date || task.due_date === null).toBe(true);

      expect(typeof holon.type).toBe('string');
      expect(typeof holon.name).toBe('string');
      expect(typeof holon.gender).toBe('string');
      expect(typeof holon.daily_work_hours).toBe('number');
      expect(typeof JSON.parse(holon.availability_data).currentValue).toBe('number');
      expect(typeof JSON.parse(holon.load_data).currentValue).toBe('number');
      expect(typeof JSON.parse(holon.stress_data).currentValue).toBe('number');
      expect(typeof JSON.parse(holon.cost_data).currentValue).toBe('number');
      expect(Array.isArray(JSON.parse(holon.availability_data).records)).toBe(true);
      expect(Array.isArray(JSON.parse(holon.load_data).records)).toBe(true);
      expect(Array.isArray(JSON.parse(holon.stress_data).records)).toBe(true);
      expect(Array.isArray(JSON.parse(holon.cost_data).records)).toBe(true);
      expect(typeof holon.age).toBe('number');
      expect(typeof holon.experience_years).toBe('number');
      expect(typeof holon.is_available).toBe('boolean');
    }
  });

  test('an allocation for 100 holons and tasks', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;

    const holons = [];
    const tasks = [];

    // Generate 100 random tasks and holons
    for (let i = 0; i < 100; i++) {
      holons.push(testUtils.generateHolon());
      tasks.push(testUtils.generateTask());
    }

    // Add all holons and tasks to database
    for (let i = 0; i < holons.length; i++) {
      let response = await testUtils.post('holons', token, holons[i]);
      response = response.data || response.response.data;
      expect(response.errors.length).toBe(0);

      response = await testUtils.post('tasks', token, tasks[i]);
      response = response.data || response.response.data;
      expect(response.errors.length).toBe(0);
    }

    // Retrieve all holons and tasks from the server
    let holonsResponse = await testUtils.get('holons', '', token);
    holonsResponse = holonsResponse.data || holonsResponse.response.data;
    let tasksResponse = await testUtils.get('tasks', '', token);
    tasksResponse = tasksResponse.data || tasksResponse.response.data;

    // Compare retrieved holons and tasks with created holons and tasks
    expect(tasksResponse.errors.length).toBe(0);
    expect(holonsResponse.errors.length).toBe(0);
    let serverHolons = holonsResponse.data.map((i) => i.attributes);
    let serverTasks = tasksResponse.data.map((i) => i.attributes);
    expect(serverHolons.length > 0 && serverTasks.length > 0).toBe(true);

    const createdHolons = [];
    const createdTasks = [];
    expect(
      holons.every((holon, i) => {
        let response = false;
        for (let i = 0; i < serverHolons.length; i++) {
          const serverHolon = serverHolons[i];
          if (serverHolon.name === holon.name && serverHolon.type === holon.type && serverHolon.gender === holon.gender && Number(serverHolon.age) === holon.age) {
            response = true;
            createdHolons.push(serverHolon);
            break;
          }
        }
        return response;
      })
    ).toBe(true);
    expect(
      tasks.every((task) => {
        let response = false;
        for (let i = 0; i < serverTasks.length; i++) {
          const serverTask = serverTasks[i];
          if (serverTask.name === task.name && serverTask.type === task.type && serverTask.description === task.description) {
            response = true;
            createdTasks.push(serverTask);
            break;
          }
        }
        return response;
      })
    ).toBe(true);

    // Send allocation request to REST API
    let algorithmsResponse = await testUtils.get('algorithms', '', token);
    algorithmsResponse = algorithmsResponse.data || algorithmsResponse.response.data;
    expect(algorithmsResponse.errors.length).toBe(0);
    expect(algorithmsResponse.data.length > 0).toBe(true);

    const allocationRequest = {
      holonIds: createdHolons.map((i) => i.id),
      taskIds: createdTasks.map((i) => i.id),
      algorithm: algorithmsResponse.data[0].attributes.name,
    };

    // Wait till HMAS Container has retrieved new holons
    await testUtils.wait(5);
    let allocationResponse = await testUtils.post('allocations', token, { request: JSON.stringify(allocationRequest) });
    allocationResponse = allocationResponse.data || allocationResponse.response.data;
    expect(allocationResponse.errors.length).toBe(0);

    // Wait till HMAS Container has retrieved and calculated the new allocation request
    await testUtils.wait(20);

    allocationResponse = await testUtils.get('allocations', '?id=' + allocationResponse.data[0].attributes.id, token);
    allocationResponse = allocationResponse.data || allocationResponse.response.data;
    expect(allocationResponse.errors.length).toBe(0);
    expect(allocationResponse.data.length === 1).toBe(true);

    const allocationResult = JSON.parse(allocationResponse.data[0].attributes.result);
    expect(Array.isArray(allocationResult?.allocations)).toBe(true);

    // Check if holons are assigned to tasks
    const allocatedHolonIds = [];
    const allocatedTasks = [];
    allocationResult.allocations.map((i) => allocatedHolonIds.push(...i.holonIds));
    allocationResult.allocations.map((i) => allocatedTasks.push(i.taskId));
    expect(allocatedHolonIds.length).toBe(holons.filter((i) => i.is_available).length);
    expect(allocatedTasks.length).toBe(100);
  });

  test('an allocation for 100 holons and tasks divided to 20 allocation requests', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;

    const holons = [];
    const tasks = [];

    // Generate 100 random tasks and holons
    for (let i = 0; i < 100; i++) {
      holons.push(testUtils.generateHolon());
      tasks.push(testUtils.generateTask());
    }

    // Add all holons and tasks to database
    for (let i = 0; i < holons.length; i++) {
      let response = await testUtils.post('holons', token, holons[i]);
      response = response.data || response.response.data;
      expect(response.errors.length).toBe(0);

      response = await testUtils.post('tasks', token, tasks[i]);
      response = response.data || response.response.data;
      expect(response.errors.length).toBe(0);
    }

    // Retrieve all holons and tasks from the server
    let holonsResponse = await testUtils.get('holons', '', token);
    holonsResponse = holonsResponse.data || holonsResponse.response.data;
    let tasksResponse = await testUtils.get('tasks', '', token);
    tasksResponse = tasksResponse.data || tasksResponse.response.data;

    // Compare retrieved holons and tasks with created holons and tasks
    expect(tasksResponse.errors.length).toBe(0);
    expect(holonsResponse.errors.length).toBe(0);
    let serverHolons = holonsResponse.data.map((i) => i.attributes);
    let serverTasks = tasksResponse.data.map((i) => i.attributes);
    expect(serverHolons.length > 0 && serverTasks.length > 0).toBe(true);

    const createdHolons = [];
    const createdTasks = [];
    expect(
      holons.every((holon, i) => {
        let response = false;
        for (let i = 0; i < serverHolons.length; i++) {
          const serverHolon = serverHolons[i];
          if (serverHolon.name === holon.name && serverHolon.type === holon.type && serverHolon.gender === holon.gender && Number(serverHolon.age) === holon.age) {
            response = true;
            createdHolons.push(serverHolon);
            break;
          }
        }
        return response;
      })
    ).toBe(true);
    expect(
      tasks.every((task) => {
        let response = false;
        for (let i = 0; i < serverTasks.length; i++) {
          const serverTask = serverTasks[i];
          if (serverTask.name === task.name && serverTask.type === task.type && serverTask.description === task.description) {
            response = true;
            createdTasks.push(serverTask);
            break;
          }
        }
        return response;
      })
    ).toBe(true);

    // Send allocation request to REST API
    let algorithmsResponse = await testUtils.get('algorithms', '', token);
    algorithmsResponse = algorithmsResponse.data || algorithmsResponse.response.data;
    expect(algorithmsResponse.errors.length).toBe(0);
    expect(algorithmsResponse.data.length > 0).toBe(true);

    const allocationRequests = [];
    const holonIds = createdHolons.map((i) => i.id);
    const taskIds = createdTasks.map((i) => i.id);

    for (let i = 0; i < 20; i++) {
      allocationRequests.push({
        taskIds: taskIds.splice(0, 5),
        holonIds: holonIds.splice(0, 5),
        algorithm: algorithmsResponse.data[Math.floor(Math.random() * (algorithmsResponse.data.length - 1 + 0.45))].attributes.name,
      });
    }

    // Wait till HMAS Container has retrieved new holons
    await testUtils.wait(10);

    // Create allocation requests
    const allocationResponses = [];
    for (let i = 0; i < 20; i++) {
      let allocationResponse = await testUtils.post('allocations', token, { request: JSON.stringify(allocationRequests[i]) });
      allocationResponse = allocationResponse.data || allocationResponse.response.data;
      expect(allocationResponse.errors.length).toBe(0);
      allocationResponses.push(allocationResponse);
    }

    expect(allocationResponses.length).toBe(20);

    // Wait till HMAS Container has retrieved and calculated the new allocation requests
    await testUtils.wait(30);

    // Retrieve allocation results
    const allocationResults = [];
    for (let i = 0; i < 20; i++) {
      let allocationResponse = await testUtils.get('allocations', '?id=' + allocationResponses[i].data[0].attributes.id, token);
      allocationResponse = allocationResponse.data || allocationResponse.response.data;
      expect(allocationResponse.errors.length).toBe(0);
      expect(allocationResponse.data.length === 1).toBe(true);
      expect(JSON.parse(allocationResponse.data[0].attributes.result).error).toBe(undefined);
      allocationResults.push(allocationResponse);
    }

    for (let i = 0; i < 20; i++) {
      const allocationResult = JSON.parse(allocationResults[i].data[0].attributes.result);
      // Check if holons are assigned to tasks
      const allocatedHolonIds = [];
      const allocatedTasks = [];
      allocationResult.allocations.map((i) => allocatedHolonIds.push(...i.holonIds));
      allocationResult.allocations.map((i) => allocatedTasks.push(i.taskId));
      const allocationRequest = allocationRequests[i];
      const allocationHolons = createdHolons.filter((i) => allocationRequest.holonIds.includes(i.id));
      expect(allocatedHolonIds.length).toBe(allocationHolons.filter((i) => i.is_available).length);
      expect(allocatedTasks.length).toBe(5);
    }
  });

  test('an allocation for 100 holons and tasks divided to 20 allocation requests and complete request', async () => {
    let result = await testUtils.login('user', 'password');
    const token = result.data.data[0].attributes.token;

    const holons = [];
    const tasks = [];

    // Generate 100 random tasks and holons
    for (let i = 0; i < 100; i++) {
      holons.push(testUtils.generateHolon());
      tasks.push(testUtils.generateTask());
    }

    // Add all holons and tasks to database
    for (let i = 0; i < holons.length; i++) {
      let response = await testUtils.post('holons', token, holons[i]);
      response = response.data || response.response.data;
      expect(response.errors.length).toBe(0);

      response = await testUtils.post('tasks', token, tasks[i]);
      response = response.data || response.response.data;
      expect(response.errors.length).toBe(0);
    }

    // Retrieve all holons and tasks from the server
    let holonsResponse = await testUtils.get('holons', '', token);
    holonsResponse = holonsResponse.data || holonsResponse.response.data;
    let tasksResponse = await testUtils.get('tasks', '', token);
    tasksResponse = tasksResponse.data || tasksResponse.response.data;

    // Compare retrieved holons and tasks with created holons and tasks
    expect(tasksResponse.errors.length).toBe(0);
    expect(holonsResponse.errors.length).toBe(0);
    let serverHolons = holonsResponse.data.map((i) => i.attributes);
    let serverTasks = tasksResponse.data.map((i) => i.attributes);
    expect(serverHolons.length > 0 && serverTasks.length > 0).toBe(true);

    const createdHolons = [];
    const createdTasks = [];
    expect(
      holons.every((holon, i) => {
        let response = false;
        for (let i = 0; i < serverHolons.length; i++) {
          const serverHolon = serverHolons[i];
          if (serverHolon.name === holon.name && serverHolon.type === holon.type && serverHolon.gender === holon.gender && Number(serverHolon.age) === holon.age) {
            response = true;
            createdHolons.push(serverHolon);
            break;
          }
        }
        return response;
      })
    ).toBe(true);
    expect(
      tasks.every((task) => {
        let response = false;
        for (let i = 0; i < serverTasks.length; i++) {
          const serverTask = serverTasks[i];
          if (serverTask.name === task.name && serverTask.type === task.type && serverTask.description === task.description) {
            response = true;
            createdTasks.push(serverTask);
            break;
          }
        }
        return response;
      })
    ).toBe(true);

    // Send allocation request to REST API
    let algorithmsResponse = await testUtils.get('algorithms', '', token);
    algorithmsResponse = algorithmsResponse.data || algorithmsResponse.response.data;
    expect(algorithmsResponse.errors.length).toBe(0);
    expect(algorithmsResponse.data.length > 0).toBe(true);

    const allocationRequests = [];
    const holonIds = createdHolons.map((i) => i.id);
    const taskIds = createdTasks.map((i) => i.id);

    for (let i = 0; i < 20; i++) {
      allocationRequests.push({
        taskIds: taskIds.splice(0, 5),
        holonIds: holonIds.splice(0, 5),
        algorithm: algorithmsResponse.data[Math.floor(Math.random() * (algorithmsResponse.data.length - 1 + 0.45))].attributes.name,
      });
    }

    // Wait till HMAS Container has retrieved new holons
    await testUtils.wait(8);

    // Create allocation requests
    const allocationResponses = [];
    for (let i = 0; i < 20; i++) {
      let allocationResponse = await testUtils.post('allocations', token, { request: JSON.stringify(allocationRequests[i]) });
      allocationResponse = allocationResponse.data || allocationResponse.response.data;
      expect(allocationResponse.errors.length).toBe(0);
      allocationResponses.push(allocationResponse);
    }

    expect(allocationResponses.length).toBe(20);

    // Wait till HMAS Container has retrieved and calculated the new allocation requests
    await testUtils.wait(30);

    // Retrieve allocation results
    const allocationResults = [];
    for (let i = 0; i < 20; i++) {
      let allocationResponse = await testUtils.get('allocations', '?id=' + allocationResponses[i].data[0].attributes.id, token);
      allocationResponse = allocationResponse.data || allocationResponse.response.data;
      expect(allocationResponse.errors.length).toBe(0);
      expect(allocationResponse.data.length === 1).toBe(true);
      expect(JSON.parse(allocationResponse.data[0].attributes.result).error).toBe(undefined);
      allocationResults.push(allocationResponse);
    }

    for (let i = 0; i < 20; i++) {
      const allocationResult = JSON.parse(allocationResults[i].data[0].attributes.result);
      // Check if holons are assigned to tasks
      const allocatedHolonIds = [];
      const allocatedTasks = [];
      allocationResult.allocations.map((i) => allocatedHolonIds.push(...i.holonIds));
      allocationResult.allocations.map((i) => allocatedTasks.push(i.taskId));
      const allocationRequest = allocationRequests[i];
      const allocationHolons = createdHolons.filter((i) => allocationRequest.holonIds.includes(i.id));
      expect(allocatedHolonIds.length).toBe(allocationHolons.filter((i) => i.is_available).length);
      expect(allocatedTasks.length).toBe(5);
    }

    // Retrieve complete allocation results
    const allocationCompleteResults = [];
    for (let i = 0; i < 20; i++) {
      let allocationResponse = await testUtils.post('allocations/' + allocationResponses[i].data[0].attributes.id + '/complete-requests', token, null);
      allocationResponse = allocationResponse.data || allocationResponse.response.data;
      expect(allocationResponse.errors.length).toBe(0);
      expect(allocationResponse.data.length === 1).toBe(true);
      expect(typeof allocationResponse.data[0].attributes.completed_on).toBe('string');
      allocationCompleteResults.push(allocationResponse);
    }

    // Retrieve newly created holons and tasks and check whether backend has completed allocations properly
    // Retrieve all holons and tasks from the server
    holonsResponse = await testUtils.get('holons', '', token);
    holonsResponse = holonsResponse.data || holonsResponse.response.data;
    tasksResponse = await testUtils.get('tasks', '', token);
    tasksResponse = tasksResponse.data || tasksResponse.response.data;

    // Compare retrieved holons and tasks with previously created holons and tasks
    expect(tasksResponse.errors.length).toBe(0);
    expect(holonsResponse.errors.length).toBe(0);
    serverHolons = holonsResponse.data.map((i) => i.attributes);
    serverTasks = tasksResponse.data.map((i) => i.attributes);
    expect(serverHolons.length > 0 && serverTasks.length > 0).toBe(true);

    createdHolons.length = 0;
    createdTasks.length = 0;
    expect(
      holons.every((holon, i) => {
        let response = false;
        for (let i = 0; i < serverHolons.length; i++) {
          const serverHolon = serverHolons[i];
          if (serverHolon.name === holon.name && serverHolon.type === holon.type && serverHolon.gender === holon.gender && Number(serverHolon.age) === holon.age) {
            response = true;
            createdHolons.push(serverHolon);
            break;
          }
        }
        return response;
      })
    ).toBe(true);
    expect(
      tasks.every((task) => {
        let response = false;
        for (let i = 0; i < serverTasks.length; i++) {
          const serverTask = serverTasks[i];
          if (serverTask.name === task.name && serverTask.type === task.type && serverTask.description === task.description) {
            response = true;
            createdTasks.push(serverTask);
            break;
          }
        }
        return response;
      })
    ).toBe(true);

    // Check if each avaialble holon is assigned to at least one of the tasks
    for (let i = 0; i < createdHolons.length; i++) {
      const availabilityData = JSON.parse(createdHolons[i].availability_data);
      if (createdHolons[i].is_available) expect(availabilityData.currentValue).toBe(1);
    }

    const assignedIds = [];
    for(let i=0;i<createdTasks.length;i++) {
        const assignedToIds = JSON.parse(createdTasks[i].assigned_to).ids;
        assignedIds.push(...assignedToIds);
    }

    expect(createdHolons.filter(i => i.is_available).length).toBe(assignedIds.length);
  });
});
