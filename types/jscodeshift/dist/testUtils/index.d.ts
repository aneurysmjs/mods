declare module 'jscodeshift/dist/testUtils' {
  /**
   * d.ts declare module not work when import third party libs
   *
   * @link https://stackoverflow.com/a/60797897/5378393
   */
  import type { Transform } from 'jscodeshift';

  type Module =
    | {
        default?: Transform;
        parser?: string;
      }
    | Transform;

  interface TransformInput {
    source: string;
  }

  interface TestOptions {
    parser?: string;
  }

  export declare function applyTransform(
    module: Module,
    options: Record<string, unknown>,
    input: TransformInput,
    testOptions: TestOptions = {},
  ): string;

  export declare function defineTest(
    dirName: string,
    transformName: string,
    options: Record<string, unknown> | null,
    testFilePrefix: string,
    testOptions: { parser: string; [K: string]: unknown },
  ): string;

  export declare function runInlineTest(
    module: string,
    transformName: string,
    options: Record<string, unknown> | null,
    testFilePrefix: string,
    testOptions: { parser: string; [K: string]: unknown },
  ): string;
}
