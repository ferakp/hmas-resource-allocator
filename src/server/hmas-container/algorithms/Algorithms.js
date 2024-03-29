import * as FindBestMatch from './FindBestMatch';
import * as FindMaximumExecution from './FindMaximumExecution';
import * as FindOptimal from './FindOptimal';
import * as FindHeavyTask from './FindHeavyTask';
import * as FindBySpecialization from './FindBySpecialization';

/**
 * Each algorithm should have type, name, run function and description
 * @returns {array} algorithms
 */
export function getAlgorithms() {
  const algorithms = [];

  algorithms.push({ type: 'Custom', name: 'FindBestMatch', run: FindBestMatch.run, description: findBestMatchDescription });
  algorithms.push({ type: 'Custom', name: 'FindMaximumExecution', run: FindMaximumExecution.run, description: findMaximumExecutionDescription });
  algorithms.push({ type: 'Custom', name: 'FindOptimal', run: FindOptimal.run, description: findOptimalDescription });
  algorithms.push({ type: 'Custom', name: 'FindHeavyTask', run: FindHeavyTask.run, description: findHeavyTaskDescription });
  algorithms.push({ type: 'Custom', name: 'FindBySpecialization', run: FindBySpecialization.run, description: findBySpecializationDescription });
  return algorithms;
}

const findBestMatchDescription =
  'The Find Best Match algorithm is a greedy algorithm which collects best holons for each task. After finding the best possible holons for each task, ' +
  ' the iterator chooses the task with highest priority and assigns the best available holon to the task before repeating itself.';

const findMaximumExecutionDescription =
  'The Find Maximum Execution algorithm is a greedy algorithm with a goal of maximizing number of executed tasks. It rearrange the list of the tasks by estimated_time parameter.' +
  ' During each iteration it select the shortest available task and assigns the best available holon(s) to the task.';

const findOptimalDescription =
  'The Find Optimal algorithm is a greedy algorithm which calculates the most optimal allocation by taking into account the resource demands, the priorities of tasks and fair share principle.' +
  ' It orders tasks according to their priorities and then slices list from the middle point. During each iteration it chooses a task from both lists and assings available holons to them. ';

const findHeavyTaskDescription =
  'The Find Heavy Task algorithm is a greedy algorithm which calculates a response for the allocation request by prioritizing the heaviest tasks according to their estimated time.' +
  ' It orders tasks according to their estimated times and starts from the heaviest ones. During each iteration it chooses a task from the list and assings available holons to them. ';

const findBySpecializationDescription =
  'The Find By Specialization algorithm is a greedy algorithm which calculates a response for the allocation request by prioritizing the holons who have specialization.' +
  ' It orders tasks according to their estimated times and starts from the lightest ones. During each iteration it chooses a task from the list and assings available holons to them. The holons whose' +
  ' specialization is same as the type of the task have higher chance to be selected than other holons.';
