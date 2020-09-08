import {
  Component,
  ComponentBindings,
  OneWay,
  Ref,
  Method,
  JSXComponent,
} from "../../../../component_declaration/common";

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
