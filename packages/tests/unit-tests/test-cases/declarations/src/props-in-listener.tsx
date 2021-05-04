import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Event,
  Listen,
} from "@devextreme-generator/declarations";

function view(model: Widget):JSX.Element|null {
  return <div></div>;
}

@ComponentBindings()
export class Props {
  @OneWay() type?: string;
  @Event() onClick?: (e: any) => void;
}

@Component({
  name: "Component",
  view,
})
export class Widget extends JSXComponent(Props) {
  @Listen("click")
  clickHandler() {
    this.props.onClick!({ type: this.props.type });
  }
}
