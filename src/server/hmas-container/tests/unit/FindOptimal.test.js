import * as FindOptimal from '../../algorithms/FindOptimal';

const holonSample1 = { id: 1, daily_work_hours: 8, experience_years: 10, is_available: true, availability_data: { currentValue: 0 }, cost_data: { currentValue: 0 } };
const holonSample2 = { id: 2, daily_work_hours: 8, experience_years: 10, is_available: true, availability_data: { currentValue: 0.22 }, cost_data: { currentValue: 0.133 } };
const holonSample3 = { id: 3, daily_work_hours: 8, experience_years: 10, is_available: true, availability_data: { currentValue: 0 }, cost_data: { currentValue: 0.2 } };
let dueDateSample1 = new Date();
dueDateSample1 = new Date(dueDateSample1.getTime() + 1000 * 60 * 60 * 85);
let dueDateSample2 = new Date();
dueDateSample2 = new Date(dueDateSample2.getTime() + 1000 * 60 * 60 * 85);
const taskSample1 = {
  id: 1,
  priority: 3,
  is_completed: false,
  estimated_time: 53,
  resource_demand: { demands: [['ordinary', 5, ['sql']]] },
  start_date: null,
  due_date: null,
};
const taskSample2 = {
  id: 2,
  priority: 5,
  is_completed: false,
  estimated_time: 13,
  resource_demand: { demands: [['ordinary', 5, ['sql']]] },
  start_date: new Date(),
  due_date: dueDateSample1,
};
const taskSample3 = {
  id: 3,
  priority: 0,
  is_completed: false,
  estimated_time: 103,
  resource_demand: { demands: [['ordinary', 5, ['java']]] },
  start_date: new Date(),
  due_date: dueDateSample2,
};
const taskSample4 = {
  id: 4,
  priority: 0,
  is_completed: false,
  estimated_time: 4,
  resource_demand: { demands: [['ordinary', 5, ['java']]] },
  start_date: new Date(),
  due_date: dueDateSample2,
};
const taskSample5 = {
  id: 5,
  priority: 0,
  is_completed: false,
  estimated_time: 3,
  resource_demand: { demands: [['ordinary', 5, ['java']]] },
  start_date: new Date(),
  due_date: dueDateSample2,
};

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
    const clonedHolons = holons.map((i) => JSON.parse(JSON.stringify(i)));
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

  test('run function with holons and tasks', () => {
    const tasks = [taskSample1, taskSample2, taskSample3, taskSample4, taskSample5];
    const holons = [holonSample1, holonSample2, holonSample3];
    const clonedHolons = holons.map((i) => JSON.parse(JSON.stringify(i)));
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
        expect(allocation.holonIds[0]).toBe(2);
        expect(allocation.holonIds.length).toBe(1);
      }

      if (i === 2) {
        expect(allocation.taskId).toBe(4);
        expect(allocation.holonIds[0]).toBe(3);
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
