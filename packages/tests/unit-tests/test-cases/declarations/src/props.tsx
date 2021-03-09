import {
  Component,
  OneWay,
  Event,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declaration";

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

@ComponentBindings()
export class WidgetInput {
  @OneWay() height = 10;
  @OneWay() export: object = {};
  @OneWay() sizes?: { height: number; width: number };
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
