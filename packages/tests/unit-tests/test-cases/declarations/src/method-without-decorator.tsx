import {
  Component,
  ComponentBindings,
  JSXComponent,
  InternalState,
} from "@devextreme-generator/declarations";

function view(viewModel: Widget):JSX.Element|null {
  return <div></div>;
}

@ComponentBindings()
class WidgetInput {}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  private privateMethod(a: number) {}

  method1: (a: number) => void = (a: number): void => this.privateMethod(a);

  method2: () => any = (): null => {
    return null;
  };
}
