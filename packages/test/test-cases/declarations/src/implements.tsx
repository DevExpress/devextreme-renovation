import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "../../../../component_declaration/common";
import BaseProps from "./component-bindings-only";

const view = (model: Widget) => <span />;

interface PropsI {
  p: string;
}

interface WidgetI {
  onClick(): void;
}

@ComponentBindings()
class WidgetInput extends BaseProps implements PropsI {
  @OneWay() p: string = "10";
}
@Component({
  view,
})
export default class Widget
  extends JSXComponent(WidgetInput)
  implements WidgetI {
  onClick(): void {}
}
