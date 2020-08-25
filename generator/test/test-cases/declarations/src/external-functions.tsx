import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Event,
  TwoWay,
} from "../../../../component_declaration/common";
import { namedFunction as externalFunction } from "./functions";

function simpleFunction(index: number): string {
  return `element_${index}`;
}

const arrowFunction: () => string = () => {
  return "defaultClassName";
};

const CLASS_NAME = arrowFunction();

function view(model: Widget) {
  return (
    <div
      key={simpleFunction(model.props.index)}
      className={CLASS_NAME}
      style={externalFunction()}
    ></div>
  );
}

@ComponentBindings()
export class WidgetProps {
  @OneWay() index: number = 0;
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetProps) {}
