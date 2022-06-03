import { AngularGenerator } from '@devextreme-generator/angular';
import { compileCode, GeneratorOptions } from '@devextreme-generator/core';
import { InfernoGenerator } from '@devextreme-generator/inferno';
import { InfernoGenerator as InfernoHooksGenerator } from '@devextreme-generator/inferno-hooks';
import { PreactGenerator } from '@devextreme-generator/preact';
import { ReactGenerator } from '@devextreme-generator/react';
import { getOptions } from 'loader-utils';
import path from 'path';
import ts from 'typescript';
import { LoaderContext } from 'webpack';

import { getTsConfig } from './typescript-utils';

export default function (this: LoaderContext<{}>, source: string) {
  const {
    platform,
    defaultOptionsModule,
    jqueryComponentRegistratorModule,
    jqueryBaseComponentModule,
    tsConfig,
  } = getOptions(this) as any;
  let generator = null;

  const options: GeneratorOptions = { defaultOptionsModule };

  switch (platform) {
    case 'react':
      generator = new ReactGenerator();
      break;
    case 'angular':
      generator = new AngularGenerator();
      break;
    case 'preact':
      generator = new PreactGenerator();
      generator.options = {
        jqueryComponentRegistratorModule,
        jqueryBaseComponentModule,
      };
      break;
    case 'inferno':
      generator = new InfernoGenerator();
      generator.options = {
        jqueryComponentRegistratorModule,
        jqueryBaseComponentModule,
      };
      break;
    case 'inferno-hooks':
      generator = new InfernoHooksGenerator();
      break;
    default:
      throw new Error('Invalid platform');
  }

  generator.options = {
    ...generator.options,
    ...options,
  };

  const result = compileCode(
    generator,
    source,
    {
      path: this.resourcePath,
      dirname: path.dirname(this.resourcePath),
    },
    false,
  );

  if (tsConfig) {
    const compilationResult = ts.transpileModule(
      result as string,
      getTsConfig(tsConfig),
    );
    return compilationResult.outputText;
  }
  return result;
}
