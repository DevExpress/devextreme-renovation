import { Options } from "./types.d";
import {
  ComponentBindings,
  OneWay,
  Component,
  JSXComponent,
  Effect,
} from "../../../../component_declaration/common";

export const viewFunction = (viewModel: Marker) => <div></div>;

@ComponentBindings()
export class MarkerProps {
  @OneWay() color?: Options;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Marker extends JSXComponent(MarkerProps) {}
