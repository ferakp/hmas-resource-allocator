import * as FindBestMatch from './FindBestMatch';
import * as FindMaximumExecution from './FindMaximumExecution';
import * as FindOptimal from './FindOptimal';

/**
 * Each algorithm should have type, name, run function and description
 * @returns {array} algorithms
 */
export function getAlgorithms() {
  const algorithms = [];

  algorithms.push({ type: 'Custom', name: 'FindBestMatch', run: FindBestMatch.run, description: findBestMatchDescription });
  algorithms.push({ type: 'Custom', name: ' FindMaximumExecution', run: FindMaximumExecution.run, description: findMaximumExecutionDescription });
  algorithms.push({ type: 'Custom', name: 'FindOptimal', run: FindOptimal.run, description: findOptimalDescription });
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
