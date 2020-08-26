import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "../../../../component_declaration/common";
import { namedFunction as externalFunction } from "./functions";

const arrowFunction: () => string = () => {
  return "defaultClassName";
};

const CLASS_NAME = arrowFunction();

function view(model: Widget) {
  return <div className={CLASS_NAME} style={externalFunction()}></div>;
}

@ComponentBindings()
export class WidgetProps {
  @OneWay() index: number = 0;
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetProps) {}
