import {
  Component,
  Slot,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declaration";

function view(model: Widget): any {
  return model.props.children;
}

@ComponentBindings()
class WidgetInput {
  @Slot() children?: any;
}
@Component({
  view,
})
export default class Widget extends JSXComponent(WidgetInput) {}
