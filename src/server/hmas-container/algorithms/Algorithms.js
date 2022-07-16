import * as FindBestMatch from './FindBestMatch';
import * as FindMaximumExecution from './FindMaximumExecution';
import * as FindOptimal from './FindOptimal';

export function getAlgorithms() {
  const algorithms = [];

  algorithms.push({ name: 'FindBestMatch', run: FindBestMatch.run });
  algorithms.push({ name: ' FindMaximumExecution', run: FindMaximumExecution.run });
  algorithms.push({ name: 'FindOptimal', run: FindOptimal.run });
  return algorithms;
}
