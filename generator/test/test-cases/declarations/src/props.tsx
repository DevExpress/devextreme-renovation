import {
  Component,
  OneWay,
  Event,
  ComponentBindings,
  JSXComponent,
} from "../../../../component_declaration/common";

function view(model: Widget): JSX.Element {
  return <span></span>;
}

type EventCallBack<Type> = (e: Type) => void;

@ComponentBindings()
class WidgetInput {
  @OneWay() height = 10;
  @OneWay() export: object = {};
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
