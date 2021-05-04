import {
  Component,
  OneWay,
  TwoWay,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declarations";

function view(model: Widget):JSX.Element|null {
  return <span></span>;
}

@ComponentBindings()
class WidgetInput {
  @OneWay() height: number = 10;
  @TwoWay() selected: boolean = false;
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  getHeight(): number {
    const { height } = this.props;
    const { height: _height } = this.props;
    return height + _height;
  }
  getProps(): any {
    return this.props;
  }
}
