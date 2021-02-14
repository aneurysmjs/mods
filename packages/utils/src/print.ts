import jscodeshift from 'jscodeshift';
import type { Collection } from 'jscodeshift';

/**
 *
 * @param {Collection} collection
 * @return {void}
 */
export default (collection: Collection): void => {
  console.log('source: \n\n', jscodeshift(collection.get()).toSource());
};
