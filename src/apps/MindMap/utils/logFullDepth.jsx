import { inspect } from 'util';

export function logFullDepth(obj) {
  console.log(inspect(obj, { showHidden: false, depth: null }));
}
