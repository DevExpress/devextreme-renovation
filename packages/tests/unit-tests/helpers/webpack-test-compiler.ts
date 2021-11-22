import path from "path";
import webpack from "webpack";
import { createFsFromVolume, Volume } from "memfs";
import { GeneratorOptions } from "@devextreme-generator/core";
import { GeneratorOptions as PreactGeneratorOptions } from "@devextreme-generator/preact";

export declare type Options = { platform: string; tsConfig?: string } & (
  | GeneratorOptions
  | PreactGeneratorOptions
);

export default (
  fileName: string,
  options: Options = { platform: "custom" }
) => {
  const compiler = webpack({
    context: __dirname,
    entry: path.resolve(fileName),
    output: {
      path: path.resolve(__dirname),
      filename: "bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.tsx$/,
          use: {
            loader: "@devextreme-generator/build-helpers/dist/webpack-loader",
            options: options,
          },
        },
      ],
    },
  });

  compiler.outputFileSystem = createFsFromVolume(new Volume()) as any;
  compiler.outputFileSystem.join = path.join.bind(path);

  return new Promise<webpack.Stats>((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);
      if (stats) {
        if (stats.hasErrors())
          reject(new Error(stats.toJson().errors?.map(({message}) => message).join("\n")));
        resolve(stats);
      }
    });
  });
};
