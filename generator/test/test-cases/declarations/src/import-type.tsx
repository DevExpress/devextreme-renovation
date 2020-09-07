import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "../../../../component_declaration/common";
import type { Options } from "./types.d";
import type { AdditionalOptions } from "./types.d";

export const viewFunction = (viewModel: Import) => {
  return <div>{viewModel.props.Test?.value}</div>;
};

@ComponentBindings()
export class ImportProps {
  @OneWay() Test?: Options;
}

@Component({ view: viewFunction })
export default class Import extends JSXComponent(ImportProps) {
  // ViewModel getters, Effects, Refs, go here
}
