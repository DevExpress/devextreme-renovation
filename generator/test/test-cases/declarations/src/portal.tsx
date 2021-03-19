import {
  Component,
  ComponentBindings,
  JSXComponent,
  Portal,
  Effect,
  Ref,
  OneWay,
  RefObject,
} from "../../../../component_declaration/common";

function view(model: Widget) {
  return (
    <div>
      {model.rendered ? (
        <Portal container={document.body}>
          <span></span>
        </Portal>
      ) : null}
      <Portal container={model.props.someRef?.current}>
        <span></span>
      </Portal>
    </div>
  );
}

@ComponentBindings()
export class WidgetProps {
  @Ref() someRef?: RefObject<HTMLElement>;
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
