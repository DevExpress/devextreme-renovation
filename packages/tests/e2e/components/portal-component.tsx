import {
  Component,
  ComponentBindings,
  JSXComponent,
  Portal,
  Ref,
  Effect,
  RefObject,
} from "@devextreme-generator/declarations";

function view({ props, rendered, _body }: PortalComponent) {
  return (
    <div>
      {"I render portals"}
      {rendered && (
        <Portal container={props.containerRef?.current}>
          <div>{"I'm rendered by ref"}</div>
        </Portal>
      )}
      <Portal container={_body}>
        <div>{"I'm rendered in body"}</div>
      </Portal>
    </div>
  );
}

@ComponentBindings()
class Props {
  @Ref() containerRef?: RefObject;
}

@Component({
  view,
  jQuery: {register: true},
})
export default class PortalComponent extends JSXComponent(Props) {
  rendered: boolean = false;

  @Effect({ run: "once" })
  onInit() {
    this.rendered = true;
  }

  get _body() {
    return document?.body;
  }
}
