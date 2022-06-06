/* eslint-disable import/no-extraneous-dependencies */
import { compile } from '@devextreme-generator/build-helpers';
import { resolve } from 'path';
import { ReactInfernoGenerator } from '../generator';
import { createTestGenerator } from './common';

describe('generator', () => {
  beforeAll(() => {
    compile(
      `${__dirname}/test-cases/`,
      `${__dirname}/componentFactory/`,
      'inferno',
      /.js(x?)$/,
    );
  });

  function createGenerator(): ReactInfernoGenerator {
    const root = './test-cases/';
    const generator = new ReactInfernoGenerator();
    generator.setContext(
      {
        dirname: resolve(root),
        path: resolve(root),
      },
    );
    return generator;
  }

  it('replace imports', async () => {
    const generator = await createTestGenerator('imports', createGenerator());
    expect(generator[0].code).toMatchSnapshot();
  });
  it('replace fragments', async () => {
    const generator = await createTestGenerator('fragments', createGenerator());
    expect(generator[0].code).toMatchSnapshot();
  });
  it('forward-ref and useImperativeHandler', async () => {
    const generator = await createTestGenerator('forward-ref', createGenerator());
    expect(generator[0].code).toMatchSnapshot();
  });
});
