import {
  Component,
  ComponentBindings,
  InternalState,
  JSXComponent,
} from "@devextreme-generator/declarations";

import Widget from './props-any-undefined-unknown';

function view(viewModel: MethodPassWidget) {
  return <Widget unknownProp={viewModel.someMethod} />;
}

@ComponentBindings()
class MethodPassWidgetInput {}

@Component({
  view: view,
})
export default class MethodPassWidget extends JSXComponent(MethodPassWidgetInput) {
  @InternalState() value = 1;

  someMethod(): number {
    return this.value;
  }
}
