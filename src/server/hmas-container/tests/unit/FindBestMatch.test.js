import * as FindBestMatch from '../../algorithms/FindBestMatch';
import * as graphApi from '../../api/graph-api';
import dotenv from 'dotenv';
import path from 'path';

/**
 * MAKE SURE NEO4J IS RUNNING BEFORE RUNNING THIS TEST
 *
 *
 *
 */

// Configuring test environment
jest.useRealTimers();
jest.setTimeout(250000);

const holonSample1 = {
  id: 1,
  type: 'ordinary',
  daily_work_hours: 8,
  experience_years: 10,
  is_available: true,
  availability_data: { currentValue: 0 },
  cost_data: { currentValue: 0 },
};
const holonSample2 = {
  id: 2,
  type: 'ordinary',
  daily_work_hours: 8,
  experience_years: 10,
  is_available: true,
  availability_data: { currentValue: 0.22 },
  cost_data: { currentValue: 0.133 },
};
const holonSample3 = {
  id: 3,
  type: 'ordinary',
  daily_work_hours: 8,
  experience_years: 10,
  is_available: true,
  availability_data: { currentValue: 0 },
  cost_data: { currentValue: 0.2 },
};

const copyHolons = (arr) => {
  return arr.map((i) => {
    const holon = JSON.parse(JSON.stringify(i));
    holon.graphRecords = i.graphRecords;
    return holon;
  });
};

let dueDateSample1 = new Date();
dueDateSample1 = new Date(dueDateSample1.getTime() + 1000 * 60 * 60 * 85);
let dueDateSample2 = new Date();
dueDateSample2 = new Date(dueDateSample2.getTime() + 1000 * 60 * 60 * 85);
const taskSample1 = {
  id: 1,
  priority: 3,
  is_completed: false,
  estimated_time: 53,
  knowledge_tags: { tags: ['java', 'mysql'] },
  resource_demand: { demands: [['ordinary', 5, ['mysql']]] },
  start_date: null,
  due_date: null,
};
const taskSample2 = {
  id: 3,
  priority: 5,
  is_completed: false,
  estimated_time: 13,
  knowledge_tags: { tags: ['javascript', 'mysql'] },
  resource_demand: { demands: [['ordinary', 5, ['javascript']]] },
  start_date: new Date(),
  due_date: dueDateSample1,
};
const taskSample3 = {
  id: 8,
  priority: 0,
  is_completed: false,
  estimated_time: 103,
  knowledge_tags: { tags: ['java', 'mysql'] },
  resource_demand: { demands: [['ordinary', 5, ['java']]] },
  start_date: new Date(),
  due_date: dueDateSample2,
};

beforeAll(async () => {
  dotenv.config({ path: path.join(__dirname + '/../../.env') });
  graphApi.configure(process.env.GRAPH_DB_HOST, process.env.GRAPH_DB_PORT, process.env.GRAPH_DB_USERNAME, process.env.GRAPH_DB_PASSWORD);
  const emptyCommand = 'MATCH (n) DETACH DELETE n';
  const holon1Command =
    "CREATE (x:Holon {id:1, name:'Holon1'}), (y:Knowledge {name: 'mysql'}) CREATE (x)-[:knows {duration_years:4}]->(y) CREATE (x)-[:has]->(k:Issue {name:'autism'})";
  const holon2Command =
    "CREATE (x:Holon {id:2, name:'Holon2'}), (y:Knowledge {name: 'java'}) CREATE (x)-[:knows {duration_years:6}]->(y) CREATE (x)-[:has]->(k:Issue {name:'headache'})";
  const holon3Command =
    "CREATE (x:Holon {id:3, name:'Holon3'}), (y:Knowledge {name: 'javascript'}) CREATE (x)-[:knows {duration_years:2}]->(y) CREATE (x)-[:has]->(k:Issue {name:'color blind'})";
  await graphApi.executeCommand(emptyCommand);
  await graphApi.executeCommand(holon1Command);
  await graphApi.executeCommand(holon2Command);
  await graphApi.executeCommand(holon3Command);
  holonSample1.graphRecords = await graphApi.getGraph('Holon', 1);
  holonSample2.graphRecords = await graphApi.getGraph('Holon', 2);
  holonSample3.graphRecords = await graphApi.getGraph('Holon', 3);
});

afterAll(() => {
  graphApi.stop();
});

describe('Test FindBestMatch module', () => {
  test('sortByDemands function', async () => {
    const holons = [holonSample1, holonSample2, holonSample3];
    const tasks = [taskSample1, taskSample2, taskSample3];

    FindBestMatch.sortByDemands(tasks[1], holons);
    expect(holons[0].id).toBe(3);

    FindBestMatch.sortByDemands(tasks[0], holons);
    expect(holons[0].id).toBe(1);
  });

  test('sort function returns tasks in descending order', () => {
    // Test tasks
    const tasks = [];
    tasks.push({ priority: null });
    tasks.push({ priority: 5 });
    tasks.push({ priority: 2 });
    tasks.push({ priority: 3 });
    tasks.push({ priority: 1 });
    tasks.push({ priority: 8 });

    FindBestMatch.sortTasksPriority(tasks);
    expect(tasks.map((t) => t.priority).join(',')).toBe([null, 1, 2, 3, 5, 8].join(','));
  });

  test('clone holons correctly', () => {
    const holons = [];
    for (let i = 0; i < 5; i++) {
      holons.push({
        id: i,
        type: 'type',
        name: 'name',
        gender: 'gender',
        daily_work_hours: 5,
        remote_address: null,
        api_token: null,
        availability_data: { currentValue: 0, records: [] },
        load_data: { currentValue: 0, records: [] },
        stress_data: { currentValue: 0, records: [] },
        cost_data: { currentValue: 0, records: [] },
        age: 10,
        experience_years: 10,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: 1111,
        is_available: true,
        latest_state: {
          status: 'holonStatus.na',
          type: 'holonTypes.na',
          position: 'holonPositions.na',
          parentHolon: null,
          childHolons: [],
          numberOfReadMessages: 0,
          numberOfPerceptions: 0,
        },
        graphRecords: [],
      });
    }

    const clonedHolons = FindBestMatch.cloneHolons(holons);
    const keys = [
      'id',
      'type',
      'name',
      'gender',
      'daily_work_hours',
      'remote_address',
      'api_token',
      'availability_data',
      'load_data',
      'stress_data',
      'cost_data',
      'age',
      'experience_years',
      'created_on',
      'updated_on',
      'created_by',
      'is_available',
      'graphRecords',
    ];

    for (let i = 0; i < 5; i++) {
      for (let k = 0; k < keys.length; k++) {
        expect(Object.keys(clonedHolons[i]).includes(keys[k])).toBe(true);
        expect(clonedHolons[i].id).toBe(i);
        expect(clonedHolons[i].latest_state).toBe(undefined);
      }
    }
  });

  test('clone holons correctly', () => {
    const holons = [];
    for (let i = 0; i < 5; i++) {
      holons.push({
        id: i,
        type: 'type',
        name: 'name',
        gender: 'gender',
        daily_work_hours: 5,
        remote_address: null,
        api_token: null,
        availability_data: { currentValue: Math.floor(Math.random() * 50), records: [] },
        load_data: { currentValue: 0, records: [] },
        stress_data: { currentValue: 0, records: [] },
        cost_data: { currentValue: Math.floor(Math.random() * 50), records: [] },
        age: 10,
        experience_years: 10,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: 1111,
        is_available: true,
        latest_state: {
          status: 'holonStatus.na',
          type: 'holonTypes.na',
          position: 'holonPositions.na',
          parentHolon: null,
          childHolons: [],
          numberOfReadMessages: 0,
          numberOfPerceptions: 0,
        },
      });
    }

    FindBestMatch.sortHolons(holons, 'availability_data');
    for (let i = 3; i > -1; i--) {
      expect(holons[i + 1].availability_data.currentValue >= holons[i].availability_data.currentValue).toBe(true);
    }

    FindBestMatch.sortHolons(holons, 'cost_data');
    for (let i = 3; i > -1; i--) {
      expect(holons[i + 1].cost_data.currentValue >= holons[i].cost_data.currentValue).toBe(true);
    }
  });

  test('findBestMatch function returns correct allocations for given holons and tasks', () => {
    const holons = [holonSample1, holonSample2, holonSample3];
    const tasks = [taskSample1, taskSample2, taskSample3];
    FindBestMatch.sortTasksPriority(tasks);

    // Full allocation request
    const copiedHolons = copyHolons(holons);
    let allocations = [];
    for (let i = tasks.length - 1; i >= 0; i--) {
      const allocation = FindBestMatch.findBestMatch(tasks[i], copiedHolons);
      allocations.push(allocation);
    }
    expect(allocations.length).toBe(3);
    for (let i = 0; i < allocations.length; i++) {
      if (i === 0) {
        expect(allocations[i].taskId).toBe(3);
        expect(allocations[i].holonIds[0]).toBe(holonSample3.id);
        expect(allocations[i].holonIds.length).toBe(1);
      }

      if (i === 1) {
        expect(allocations[i].taskId).toBe(1);
        expect(allocations[i].holonIds[0]).toBe(holonSample1.id);
        expect(allocations[i].holonIds.length).toBe(1);
      }

      if (i === 2) {
        expect(allocations[i].taskId).toBe(8);
        expect(allocations[i].holonIds[0]).toBe(holonSample2.id);
        expect(allocations[i].holonIds.length).toBe(1);
      }
    }

    // Allocation request with only 1 holon
    allocations = [];
    const copiedHolons2 = copyHolons(holons);
    for (let i = tasks.length - 1; i >= 0; i--) {
      const allocation = FindBestMatch.findBestMatch(tasks[i], [copiedHolons2[0]]);
      allocations.push(allocation);
    }
    expect(allocations.length).toBe(3);
    for (let i = 0; i < allocations.length; i++) {
      if (i === 0) {
        expect(allocations[i].taskId).toBe(3);
        expect(allocations[i].holonIds[0]).toBe(holonSample1.id);
        expect(allocations[i].holonIds.length).toBe(1);
      }

      if (i === 1) {
        expect(allocations[i].taskId).toBe(1);
        expect(allocations[i].holonIds.length).toBe(0);
      }

      if (i === 2) {
        expect(allocations[i].taskId).toBe(8);
        expect(allocations[i].holonIds.length).toBe(0);
      }
    }
  });

  test("run function with holons whose availability_data's currentValue is 1", () => {
    const holons = [holonSample1, holonSample2, holonSample3];
    const tasks = [taskSample1, taskSample2, taskSample3];

    const copiedHolons = copyHolons(holons);
    copiedHolons.forEach((i) => (i.availability_data.currentValue = 1));

    const response = FindBestMatch.run(tasks, copiedHolons);
    expect(typeof JSON.parse(response).error).toBe('string');
  });

  test('run function with holons whose is_available field is false', () => {
    const holons = [holonSample1, holonSample2, holonSample3];
    const tasks = [taskSample1, taskSample2, taskSample3];

    const copiedHolons = copyHolons(holons);
    copiedHolons.forEach((i) => (i.is_available = false));

    const response = FindBestMatch.run(tasks, copiedHolons);
    expect(typeof JSON.parse(response).error).toBe('string');
  });

  test('run function with available holons but already completed tasks', () => {
    const holons = [holonSample1, holonSample2, holonSample3];
    const tasks = [taskSample1, taskSample2, taskSample3];

    const copiedTasks = tasks.map((i) => JSON.parse(JSON.stringify(i)));
    copiedTasks.forEach((i) => (i.is_completed = true));

    const response = FindBestMatch.run(copiedTasks, holons);
    expect(typeof JSON.parse(response).error).toBe('string');
  });

  test('run function with available holons and uncompleted tasks', () => {
    const holons = [holonSample1, holonSample2, holonSample3];
    const tasks = [taskSample1, taskSample2, taskSample3];

    const copiedTasks = tasks.map((i) => JSON.parse(JSON.stringify(i)));
    copiedTasks.map((i) => {
      if (i.start_date) i.start_date = new Date(i.start_date);
      if (i.due_date) i.due_date = new Date(i.due_date);
    });
    const copiedHolons = copyHolons(holons);
    const response = FindBestMatch.run(copiedTasks, copiedHolons);
    const parsedResponse = JSON.parse(response);

    expect(parsedResponse.allocations.length).toBe(3);
    for (let i = 0; i < parsedResponse.allocations.length; i++) {
      const allocations = parsedResponse.allocations;
      if (i === 0) {
        expect(allocations[i].taskId).toBe(3);
        expect(allocations[i].holonIds[0]).toBe(holonSample3.id);
        expect(allocations[i].holonIds.length).toBe(1);
      }

      if (i === 1) {
        expect(allocations[i].taskId).toBe(1);
        expect(allocations[i].holonIds[0]).toBe(holonSample1.id);
        expect(allocations[i].holonIds.length).toBe(1);
      }

      if (i === 2) {
        expect(allocations[i].taskId).toBe(8);
        expect(allocations[i].holonIds[0]).toBe(holonSample2.id);
        expect(allocations[i].holonIds.length).toBe(1);
      }
    }
  });

  test('run function with available holons and the tasks whose start_date is in future', () => {
    const holons = [holonSample1, holonSample2, holonSample3];
    const tasks = [taskSample1, taskSample2, taskSample3];

    const copiedTasks = tasks.map((i) => JSON.parse(JSON.stringify(i)));
    copiedTasks.map((i) => {
      if (i.start_date) {
        i.start_date = new Date(new Date(i.start_date).getTime() + 1000 * 60 * 60 * 85);
      }
      if (i.due_date) i.due_date = new Date(i.due_date);
    });
    const copiedHolons = copyHolons(holons);
    const response = FindBestMatch.run(copiedTasks, copiedHolons);
    const parsedResponse = JSON.parse(response);

    expect(parsedResponse.allocations.length).toBe(1);
    for (let i = 0; i < parsedResponse.allocations.length; i++) {
      const allocations = parsedResponse.allocations;
      if (i === 0) {
        expect(allocations[i].taskId).toBe(1);
        expect(allocations[i].holonIds[0]).toBe(holonSample1.id);
        expect(allocations[i].holonIds.length).toBe(1);
      }
    }
  });

  test('run function with available holons and the tasks whose estimated_time is null', () => {
    const holons = [holonSample1, holonSample2, holonSample3];
    const tasks = [taskSample1, taskSample2, taskSample3];

    const copiedTasks = tasks.map((i) => JSON.parse(JSON.stringify(i)));
    copiedTasks.map((i) => {
      if (i.start_date) i.start_date = new Date(i.start_date);
      if (i.due_date) i.due_date = new Date(i.due_date);
      i.estimated_time = null;
    });
    const copiedHolons = copyHolons(holons);
    const response = FindBestMatch.run(copiedTasks, copiedHolons);
    const parsedResponse = JSON.parse(response);

    expect(parsedResponse.allocations.length).toBe(3);
    for (let i = 0; i < parsedResponse.allocations.length; i++) {
      const allocations = parsedResponse.allocations;
      if (i === 0) {
        expect(allocations[i].taskId).toBe(3);
        expect(allocations[i].holonIds[0]).toBe(holonSample3.id);
        expect(allocations[i].holonIds.length).toBe(1);
      }

      if (i === 1) {
        expect(allocations[i].taskId).toBe(1);
        expect(allocations[i].holonIds[0]).toBe(holonSample1.id);
        expect(allocations[i].holonIds.length).toBe(1);
      }

      if (i === 2) {
        expect(allocations[i].taskId).toBe(8);
        expect(allocations[i].holonIds[0]).toBe(holonSample2.id);
        expect(allocations[i].holonIds.length).toBe(1);
      }
    }
  });

  test('run function with available holons and the tasks that need more resources than there is available', () => {
    const holons = [holonSample1, holonSample2, holonSample3];
    const tasks = [taskSample1, taskSample2, taskSample3];

    const copiedTasks = tasks.map((i) => JSON.parse(JSON.stringify(i)));
    copiedTasks.map((i, index) => {
      if (i.start_date) i.start_date = new Date(i.start_date);
      if (i.due_date) i.due_date = new Date(i.due_date);
      if (index === 1) {
        i.estimated_time = 790;
        const date = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 85);
        i.due_date = date;
      }
    });
    const copiedHolons = copyHolons(holons);
    const response = FindBestMatch.run(copiedTasks, copiedHolons);
    const parsedResponse = JSON.parse(response);

    expect(parsedResponse.allocations.length).toBe(3);
    for (let i = 0; i < parsedResponse.allocations.length; i++) {
      const allocations = parsedResponse.allocations;
      if (i === 0) {
        expect(allocations[i].taskId).toBe(3);
        expect(allocations[i].holonIds[0]).toBe(holonSample3.id);
        expect(allocations[i].holonIds[1]).toBe(holonSample1.id);
        expect(allocations[i].holonIds.length).toBe(2);
      }

      if (i === 1) {
        expect(allocations[i].taskId).toBe(1);
        expect(allocations[i].holonIds[0]).toBe(holonSample2.id);
        expect(allocations[i].holonIds.length).toBe(1);
      }

      if (i === 2) {
        expect(allocations[i].taskId).toBe(8);
        expect(allocations[i].holonIds.length).toBe(0);
      }
    }
  });
});
