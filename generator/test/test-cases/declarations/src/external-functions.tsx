import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "../../../../component_declaration/common";
import { namedFunction as externalFunction } from "./functions";

declare type Cell = {
  text: string;
  visible: boolean;
};

const arrowFunction: () => string = () => {
  return "defaultClassName";
};

const conditionFn: (cell: Cell) => boolean = (cell) => {
  return cell.visible;
};

const CLASS_NAME = arrowFunction();

function view(model: Widget) {
  return (
    <div className={CLASS_NAME} style={externalFunction()}>
      {model.props.cells.map((cell, index) => (
        <span key={index}>
          {conditionFn(cell) && index > 0 && <div>{index}</div>}
        </span>
      ))}
    </div>
  );
}

@ComponentBindings()
export class WidgetProps {
  @OneWay() cells: Cell[] = [];
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetProps) {}
