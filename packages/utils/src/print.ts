import * as core from 'jscodeshift/src/core';
import type { Collection } from 'jscodeshift';

/**
 *
 * @param {Collection} collection
 * @return {void}
 */
export default (collection: Collection): void => {
  console.log('source: \n\n', core(collection.get()).toSource());
};
