import {
  Component,
  ComponentBindings,
  OneWay,
  Ref,
  Method,
  JSXComponent,
} from "@devextreme-generator/declaration";

const view = () => <div></div>;

@ComponentBindings()
class WidgetInput {}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  @Method()
  render(renderOptions?: unknown): void {}

  @Method()
  state(stateOptions?: unknown): object {
    return {};
  }
}
