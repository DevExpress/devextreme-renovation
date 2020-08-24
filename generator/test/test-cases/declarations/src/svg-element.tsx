import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "../../../../component_declaration/common";

@ComponentBindings()
export class WidgetInput {}

@Component({
  view,
})
export default class Widget extends JSXComponent(WidgetInput) {}

function view(viewModel: Widget) {
  return <svg {...viewModel.restAttributes}></svg>;
}
