import * as FindMaximumExecution from '../../algorithms/FindMaximumExecution';
import * as graphApi from '../../api/graph-api';
import dotenv from 'dotenv';
import path from 'path';

/**
 * MAKE SURE NEO4J IS RUNNING BEFORE RUNNING THIS TEST
 *
 * This test configures the Graph API using the .env file variables
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
  knowledge_tags: { tags: ['sql'] },
  resource_demand: { demands: [['ordinary', 5, ['sql']]] },
  start_date: null,
  due_date: null,
};
const taskSample2 = {
  id: 2,
  priority: 5,
  is_completed: false,
  estimated_time: 13,
  knowledge_tags: { tags: ['mysql'] },
  resource_demand: { demands: [['ordinary', 5, ['mysql']]] },
  start_date: new Date(),
  due_date: dueDateSample1,
};
const taskSample3 = {
  id: 3,
  priority: 0,
  is_completed: false,
  estimated_time: 103,
  knowledge_tags: { tags: ['java'] },
  resource_demand: { demands: [['ordinary', 5, ['java']]] },
  start_date: new Date(),
  due_date: dueDateSample2,
};
const taskSample4 = {
  id: 4,
  priority: 0,
  is_completed: false,
  estimated_time: 4,
  knowledge_tags: { tags: ['javascript'] },
  resource_demand: { demands: [['ordinary', 5, ['javascript']]] },
  start_date: new Date(),
  due_date: dueDateSample2,
};
const taskSample5 = {
  id: 5,
  priority: 0,
  is_completed: false,
  estimated_time: 3,
  knowledge_tags: { tags: ['mysql'] },
  resource_demand: { demands: [['ordinary', 5, ['mysql']]] },
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

describe('Test FindMaximumExecution module', () => {
  test('run function with tasks whose start_date is in future', () => {
    const holons = [holonSample1, holonSample2, holonSample3];
    const tasks = [taskSample1, taskSample2, taskSample3, taskSample4, taskSample5];

    const clonedHolons = copyHolons(holons);
    const clonedTasks = tasks.map((i) => {
      const task = JSON.parse(JSON.stringify(i));
      task.start_date = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 3);
      if (task.due_date) task.due_date = new Date(task.due_date);
      return task;
    });

    const response = FindMaximumExecution.run(clonedTasks, clonedHolons);
    expect(typeof JSON.parse(response).error).toBe('string');
  });

  test('run function with tasks and holons', () => {
    const holons = [holonSample1, holonSample2, holonSample3];
    const tasks = [taskSample1, taskSample2, taskSample3, taskSample4, taskSample5];

    const clonedHolons = copyHolons(holons);
    const clonedTasks = tasks.map((i) => {
      const task = JSON.parse(JSON.stringify(i));
      if (task.start_date) task.start_date = new Date(task.start_date);
      if (task.due_date) task.due_date = new Date(task.due_date);
      return task;
    });

    const response = JSON.parse(FindMaximumExecution.run(clonedTasks, clonedHolons));
    expect(response.allocations.length).toBe(5);
    for (let i = 0; i < response.allocations.length; i++) {
      const allocation = response.allocations[i];

      if (i === 0) {
        expect(allocation.taskId).toBe(5);
        expect(allocation.holonIds[0]).toBe(1);
        expect(allocation.holonIds.length).toBe(1);
      }

      if (i === 1) {
        expect(allocation.taskId).toBe(4);
        expect(allocation.holonIds[0]).toBe(3);
        expect(allocation.holonIds.length).toBe(1);
      }

      if (i === 2) {
        expect(allocation.taskId).toBe(2);
        expect(allocation.holonIds[0]).toBe(2);
        expect(allocation.holonIds.length).toBe(1);
      }

      if (i === 3) {
        expect(allocation.taskId).toBe(1);
        expect(allocation.holonIds.length).toBe(0);
      }

      if (i === 4) {
        expect(allocation.taskId).toBe(3);
        expect(allocation.holonIds.length).toBe(0);
      }
    }
  });
});
