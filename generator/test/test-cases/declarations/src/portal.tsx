import {
  Component,
  ComponentBindings,
  JSXComponent,
  Portal,
  Effect,
  Ref,
  OneWay,
} from "../../../../component_declaration/common";

function view(model: Widget) {
  return (
    <div>
      {model.rendered && (
        <Portal container={document.body}>
          <span></span>
        </Portal>
      )}
      <Portal container={model.props.someRef}>
        <span></span>
      </Portal>
    </div>
  );
}

@ComponentBindings()
export class WidgetProps {
  @Ref() someRef?: HTMLElement;
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetProps) {
  rendered: boolean = false;

  @Effect({ run: "once" })
  onInit() {
    this.rendered = true;
  }
}
