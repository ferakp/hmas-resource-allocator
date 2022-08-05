import * as FindMaximumExecution from '../../algorithms/FindMaximumExecution';

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

describe('Test FindMaximumExecution module', () => {
  test('run function with tasks whose start_date is in future', () => {
    const holons = [holonSample1, holonSample2, holonSample3];
    const tasks = [taskSample1, taskSample2, taskSample3, taskSample4, taskSample5];

    const clonedHolons = holons.map((i) => JSON.parse(JSON.stringify(i)));
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

    const clonedHolons = holons.map((i) => JSON.parse(JSON.stringify(i)));
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
        expect(allocation.holonIds[0]).toBe(2);
        expect(allocation.holonIds.length).toBe(1);
      }

      if (i === 2) {
        expect(allocation.taskId).toBe(2);
        expect(allocation.holonIds[0]).toBe(3);
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
