/**
 * Add your own Type Definition to any Javascript 3rd party module
 * @see https://medium.com/@ofir3322/add-your-own-type-definition-to-any-javascript-3rd-party-module-1fc6b11e6f10
 */
export {};

declare module 'jscodeshift' {
  /**
   * jscodeshift does not exports `RecursiveMatchNode` so that's why is redefined heres
   */
  export type RecursiveMatchNode<T> =
    | (T extends object
        ? {
            [K in keyof T]?: RecursiveMatchNode<T[K]>;
          }
        : T)
    | ((value: T) => boolean);
}
