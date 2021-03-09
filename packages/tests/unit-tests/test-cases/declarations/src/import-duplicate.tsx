import { Options } from "./types.d";
import {
  ComponentBindings,
  OneWay,
  Component,
  JSXComponent,
  Effect,
} from "@devextreme-generator/declaration";

export const viewFunction = (viewModel: Marker) => <div></div>;

export interface InterfaceConfig {
  value?: boolean;
}

export type TypeConfig = {
  value?: boolean;
};
@ComponentBindings()
export class MarkerProps {
  @OneWay() color?: Options;
  @OneWay() date?: Date;
  @OneWay() config?: InterfaceConfig | TypeConfig;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Marker extends JSXComponent(MarkerProps) {}
