import {
  Component,
  ComponentBindings,
  JSXComponent,
  Fragment
} from "@devextreme-generator/declarations";

function view(viewModel: WidgetProps) {
  return <Fragment/>;
}

@ComponentBindings()
export class WidgetProps {}

@Component({
  view: view,
})
export class WidgetWithProps extends JSXComponent(WidgetProps) {
}

