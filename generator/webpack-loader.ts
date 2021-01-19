import { getOptions } from "loader-utils";
import { ReactGenerator } from "./react-generator";
import { AngularGenerator } from "./angular-generator/angular-generator";
import { VueGenerator } from "./vue-generator/vue-generator";
import { PreactGenerator } from "./preact-generator";
import { InfernoGenerator } from "./inferno-generator/inferno-generator";
import ts from "typescript";
import path from "path";
import { GeneratorOptions } from "./base-generator/types";
import { loader } from "webpack";
import { compileCode } from "./component-compiler";
import { getTsConfig } from "./utils/typescript-utils";

export default function (this: loader.LoaderContext, source: string) {
  const {
    platform,
    defaultOptionsModule,
    jqueryComponentRegistratorModule,
    jqueryBaseComponentModule,
    modulesPath,
    tsConfig,
  } = getOptions(this) as any;
  let generator = null;

  const options: GeneratorOptions = { defaultOptionsModule };

  switch (platform) {
    case "react":
      generator = new ReactGenerator();
      break;
    case "angular":
      generator = new AngularGenerator();
      break;
    case "vue":
      generator = new VueGenerator();
      break;
    case "preact":
      generator = new PreactGenerator();
      generator.options = {
        jqueryComponentRegistratorModule,
        jqueryBaseComponentModule,
      };
      break;
    case "inferno":
      generator = new InfernoGenerator();
      generator.options = {
        jqueryComponentRegistratorModule,
        jqueryBaseComponentModule,
        modulesPath,
      };
      break;
    default:
      throw new Error("Invalid platform");
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
    false
  );

  if (tsConfig) {
    const compilationResult = ts.transpileModule(
      result as string,
      getTsConfig(tsConfig)
    );
    return compilationResult.outputText;
  }
  return result;
}
