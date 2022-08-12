import * as FindOptimal from '../../algorithms/FindOptimal';
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
  knowledge_tags: {tags: ["sql"]},
  resource_demand: { demands: [['ordinary', 5, ['sql']]] },
  start_date: null,
  due_date: null,
};
const taskSample2 = {
  id: 2,
  priority: 5,
  is_completed: false,
  estimated_time: 13,
  knowledge_tags: {tags: ["mysql"]},
  resource_demand: { demands: [['ordinary', 5, ['mysql']]] },
  start_date: new Date(),
  due_date: dueDateSample1,
};
const taskSample3 = {
  id: 3,
  priority: 0,
  is_completed: false,
  estimated_time: 103,
  knowledge_tags: {tags: ["java"]},
  resource_demand: { demands: [['ordinary', 5, ['java']]] },
  start_date: new Date(),
  due_date: dueDateSample2,
};
const taskSample4 = {
  id: 4,
  priority: 0,
  is_completed: false,
  estimated_time: 4,
  knowledge_tags: {tags: ["javascript"]},
  resource_demand: { demands: [['ordinary', 5, ['javascript']]] },
  start_date: new Date(),
  due_date: dueDateSample2,
};
const taskSample5 = {
  id: 5,
  priority: 0,
  is_completed: false,
  estimated_time: 3,
  knowledge_tags: {tags: ["mysql"]},
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


describe('Test FindBestMatch module', () => {
  test('sortTasksOptimal function', () => {
    const tasks = [taskSample1, taskSample2, taskSample3, taskSample4, taskSample5];
    FindOptimal.sortTasksOptimal(tasks);

    expect(tasks[0].id).toBe(5);
    expect(tasks[1].id).toBe(3);
    expect(tasks[2].id).toBe(4);
    expect(tasks[3].id).toBe(1);
    expect(tasks[4].id).toBe(2);
  });

  test('run function with holons and tasks', () => {
    const tasks = [taskSample1, taskSample2, taskSample3, taskSample4, taskSample5];
    const holons = [holonSample1, holonSample2, holonSample3];
    const clonedHolons = copyHolons(holons);
    const clonedTasks = tasks.map((i) => {
      if (i.start_date) i.start_date = new Date(i.start_date);
      if (i.due_date) i.due_date = new Date(i.due_date);
      return i;
    });

    const response = JSON.parse(FindOptimal.run(clonedTasks, clonedHolons));
    for (let i = 0; i < response.allocations.length; i++) {
      const allocation = response.allocations[i];
      if (i === 0) {
        expect(allocation.taskId).toBe(5);
        expect(allocation.holonIds[0]).toBe(1);
        expect(allocation.holonIds.length).toBe(1);
      }

      if (i === 1) {
        expect(allocation.taskId).toBe(3);
        expect(allocation.holonIds[0]).toBe(2);
        expect(allocation.holonIds[1]).toBe(3);
        expect(allocation.holonIds.length).toBe(2);
      }

      if (i === 2) {
        expect(allocation.taskId).toBe(4);
        expect(allocation.holonIds.length).toBe(0);
      }

      if (i === 3) {
        expect(allocation.taskId).toBe(1);
        expect(allocation.holonIds.length).toBe(0);
      }

      if (i === 4) {
        expect(allocation.taskId).toBe(2);
        expect(allocation.holonIds.length).toBe(0);
      }
    }
  });

  test('run function with holons and tasks with custom estimated_time of the third task', () => {
    const tasks = [taskSample1, taskSample2, taskSample3, taskSample4, taskSample5];
    const holons = [holonSample1, holonSample2, holonSample3];
    const clonedHolons = copyHolons(holons);
    const clonedTasks = tasks.map((i, index) => {
      if (i.start_date) i.start_date = new Date(i.start_date);
      if (i.due_date) i.due_date = new Date(i.due_date);
      if (index === 2) i.estimated_time = 20;
      return i;
    });

    const response = JSON.parse(FindOptimal.run(clonedTasks, clonedHolons));
    for (let i = 0; i < response.allocations.length; i++) {
      const allocation = response.allocations[i];
      if (i === 0) {
        expect(allocation.taskId).toBe(5);
        expect(allocation.holonIds[0]).toBe(1);
        expect(allocation.holonIds.length).toBe(1);
      }

      if (i === 1) {
        expect(allocation.taskId).toBe(1);
        expect(allocation.holonIds[0]).toBe(3);
        expect(allocation.holonIds.length).toBe(1);
      }

      if (i === 2) {
        expect(allocation.taskId).toBe(4);
        expect(allocation.holonIds[0]).toBe(2);
        expect(allocation.holonIds.length).toBe(1);
      }

      if (i === 3) {
        expect(allocation.taskId).toBe(3);
        expect(allocation.holonIds.length).toBe(0);
      }

      if (i === 4) {
        expect(allocation.taskId).toBe(2);
        expect(allocation.holonIds.length).toBe(0);
      }
    }
  });
});
