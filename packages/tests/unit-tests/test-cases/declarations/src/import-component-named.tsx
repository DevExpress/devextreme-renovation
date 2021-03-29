import {
  Component,
  OneWay,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declarations";
import { Widget } from "./export-named";

function view(model: Child) {
  return <Widget prop={true} />;
}

@ComponentBindings()
class ChildInput {
  @OneWay() height: number = 10;
}

@Component({ view })
export default class Child extends JSXComponent(ChildInput) {}
