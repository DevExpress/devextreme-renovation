import {
  Component,
  Slot,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declarations";

const view = (model: Widget): any => model.props.children;

@ComponentBindings()
class WidgetInput {
  @Slot() children?: any;
}
@Component({
  view,
})
export default class Widget extends JSXComponent(WidgetInput) {}
