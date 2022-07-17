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
  'The Find Best Match algorithm is a greedy algorithm which collects best holons for each task. After finding best possible holons, the algorithm allocates holons according to their priorities';

const findMaximumExecutionDescription =
  'The Find Maximum Execution algorithm is a greedy algorithm which has a goal of maximizing task execution. It chooses short tasks and find holons for them before moving to larger tasks.';

const findOptimalDescription =
  'The Find Optimal algorithm is a greedy algorithm which calculates the most optimal allocation by taking into account resource demands of tasks, their priorities and fair share.';
