import {
  Component,
  ComponentBindings,
  Method,
  JSXComponent,
} from "@devextreme-generator/declarations";

import BaseWidget, { MyType, MyTypeReturn } from "./jquery-api";

function view(viewModel: Widget) {
  return <BaseWidget />;
}

@ComponentBindings()
class WidgetInput {}

@Component({
  view: view,
  jQuery: { register: true },
})
export default class Widget extends JSXComponent(WidgetInput) {
  @Method()
  getValue(arg: MyType): MyTypeReturn {
    return arg.value;
  }
}
