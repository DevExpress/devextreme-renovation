import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "@devextreme-generator/declarations";
import type { Options } from "./types.d";
import type { CustomClass } from "./types.d";

export const viewFunction = (viewModel: Import) => {
  return <div>{viewModel.props.Test?.value}</div>;
};

@ComponentBindings()
export class ImportProps {
  @OneWay() Test?: Options;
}

@Component({ view: viewFunction })
export default class Import extends JSXComponent(ImportProps) {}
