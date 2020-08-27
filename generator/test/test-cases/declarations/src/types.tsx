import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "../../../../component_declaration/common";

export const viewFunction = (viewModel: Widget) => {
  return <div></div>;
};

@ComponentBindings()
export class WidgetProps {
  @OneWay() str: String = "";
  @OneWay() num: Number = 1;
  @OneWay() bool: Boolean = true;
  @OneWay() arr: Array<any> = [];
  @OneWay() strArr: Array<String> = ["a", "b"];
  @OneWay() obj: Object = {};
  @OneWay() date: Date = new Date();
  @OneWay() func: Function = () => {};
  @OneWay() symbol: Symbol = Symbol("x");
}

@Component({ view: viewFunction })
export default class Widget extends JSXComponent(WidgetProps) {}
