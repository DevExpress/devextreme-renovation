import {
  Component,
  Slot,
  ComponentBindings,
  JSXComponent,
} from "../../../../component_declaration/common";

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
