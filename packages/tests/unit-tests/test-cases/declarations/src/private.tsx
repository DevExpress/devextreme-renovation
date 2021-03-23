import {
  Component,
  ComponentBindings,
  JSXComponent,
  InternalState,
} from "@devextreme-generator/declarations";

function view(model: Widget) {
  return <div></div>;
}

@ComponentBindings()
class WidgetInput {}
@Component({
  view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  @InternalState() private decoratedState = "";
  private simpleState = "";

  private get privateGetter() {
    return this.decoratedState.concat(this.simpleState);
  }

  simpleGetter() {
    return this.decoratedState.concat(this.simpleState);
  }
}
