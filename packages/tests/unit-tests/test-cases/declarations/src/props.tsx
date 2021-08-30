import {
  Component,
  OneWay,
  Event,
  ComponentBindings,
  JSXComponent,
  TwoWay,
} from "@devextreme-generator/declarations";

function view(model: Widget): JSX.Element {
  const sizes = model.props.sizes ?? { width: 0, height: 0 };
  return (
    <span>
      {sizes.height}
      {sizes.width}
    </span>
  );
}

type EventCallBack<Type> = (e: Type) => void;
const device = "ios";
function isDevice() { return true }

@ComponentBindings()
export class WidgetInput {
  @OneWay() height = 10;
  @OneWay() export: object = {};
  @OneWay() array = ["1"];

  @OneWay() expressionDefault: string = device === "ios" ? "yes" : "no";
  @OneWay() expressionDefault1: boolean = !device;
  @OneWay() expressionDefault2: boolean | string = isDevice() || "test";
  @OneWay() sizes?: { height: number; width: number };
  @TwoWay() stringValue: string = '';
  @Event() onClick: (a: number) => void = () => {};
  @Event() onSomething: EventCallBack<number> = () => {};
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  getHeight(): number {
    this.props.onClick(10);
    const { onClick } = this.props;
    onClick(11);
    return this.props.height;
  }

  getRestProps(): {
    export: object;
    onSomething: EventCallBack<number>;
  } {
    const { height, onClick, ...rest } = this.props;
    return rest;
  }
}
