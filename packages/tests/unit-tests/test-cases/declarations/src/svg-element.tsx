import {
  Component,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declaration";

@ComponentBindings()
export class WidgetInput {}
const view = (viewModel: Widget) => <svg {...viewModel.restAttributes}></svg>;
@Component({
  view,
  isSVG: true,
})
export default class Widget extends JSXComponent(WidgetInput) {}
