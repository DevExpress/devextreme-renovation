/* eslint-disable import/no-extraneous-dependencies */
import { compile } from '@devextreme-generator/build-helpers';
import { resolve } from 'path';
import * as fs from 'fs';
import { InfernoFromReactGenerator } from '../generator';
import { createTestGenerator } from './common';

describe('generator', () => {
  beforeAll(() => {
    if (fs.readdirSync(`${__dirname}/react-test-cases`).length !== fs.readdirSync(`${__dirname}/test-cases`).length) {
      throw new Error('Test cases are not up to date. Run `npm run update:testcases`');
    }
    compile(
      `${__dirname}/test-cases/`,
      `${__dirname}/componentFactory/`,
      'inferno',
      /.js(x?)$/,
    );
  });

  function createGenerator(): InfernoFromReactGenerator {
    const root = './test-cases/';
    const generator = new InfernoFromReactGenerator();
    generator.setContext(
      {
        dirname: resolve(root),
        path: resolve(root),
      },
    );
    return generator;
  }

  it('adds import for HookContainer', async () => {
    const generator = await createTestGenerator('import-for-hook-container', createGenerator());
    expect(generator[0].code).toMatchSnapshot();
  });

  it('adds import for InfernoWrapperComponent', async () => {
    const generator = await createTestGenerator('import-for-inferno-wrapper-component', createGenerator());
    expect(generator[0].code).toMatchSnapshot();
  });

  it('does not remove other imports from react', async () => {
    const generator = await createTestGenerator('import-without-react', createGenerator());
    expect(generator[0].code).toMatchSnapshot();
  });

  it('removes React namespace import', async () => {
    const generator = await createTestGenerator('import-react-namespace', createGenerator());
    expect(generator[0].code).toMatchSnapshot();
  });

  it('removes React default import', async () => {
    const generator = await createTestGenerator('import-react-default', createGenerator());
    expect(generator[0].code).toMatchSnapshot();
  });

  it('replace fragments', async () => {
    const generator = await createTestGenerator('fragments', createGenerator());
    expect(generator[0].code).toMatchSnapshot();
  });

  it('simple component only name', async () => {
    const generator = await createTestGenerator('simple-component', createGenerator());
    expect(generator[0].code).toMatchSnapshot();
  });

  it('forward-ref and useImperativeHandler', async () => {
    const generator = await createTestGenerator('forward-ref', createGenerator());
    expect(generator[0].code).toMatchSnapshot();
  });

  it('forward-ref and useImperativeHandler direct export const', async () => {
    const generator = await createTestGenerator('forward-ref-direct-export', createGenerator());
    expect(generator[0].code).toMatchSnapshot();
  });

  it('jQueryRegistered', async () => {
    const generator = await createTestGenerator('jquery-registred', createGenerator());
    expect(generator[0].code).toMatchSnapshot();
  });

  it('file contains component content but doesnt have "import {SimpleComponent}" statement', async () => {
    await expect(async () => createTestGenerator('no-component-export', createGenerator()))
      .rejects
      .toEqual(new Error('Not all components were processed: SimpleComponent'));
  });

  it('render several components should not raise error', async () => {
    const generator = createGenerator();
    await createTestGenerator('jquery-registred', generator);
    await createTestGenerator('jquery-registred2', generator);
  });

  it('dont change "export {}"', async () => {
    const generator = await createTestGenerator('types', createGenerator());
    expect(`${generator[0].code}`).toMatchSnapshot();
  });

  it('React.memo', async () => {
    const generator = await createTestGenerator('react-memo', createGenerator());
    expect(`${generator[0].code}`).toMatchSnapshot();
  });
});
