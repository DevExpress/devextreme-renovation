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

  it('replace imports', async () => {
    const generator = await createTestGenerator('imports', createGenerator());
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
});
