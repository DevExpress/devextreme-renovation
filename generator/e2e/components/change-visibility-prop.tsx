import {
  Component,
  OneWay,
  ComponentBindings,
  JSXComponent,
  InternalState,
  Ref,
  Effect,
} from "../../component_declaration/common";

function view(model: VisibilityChangeProp) {
  return (
    <div style={{ paddingTop: 10 }}>
      {model.props.visible ? (
        <div
          id={"change-visibility-prop-element"}
          ref={model.element as any}
          style={{
            width: 100,
            height: 20,
            backgroundColor: "green",
          }}
        >
          {model.counter}
        </div>
      ) : null}
    </div>
  );
}

@ComponentBindings()
class WidgetInput {
  @OneWay() visible: boolean = false;
}

@Component({
  view,
})
export default class VisibilityChangeProp extends JSXComponent(WidgetInput) {
  @InternalState() counter: number = 0;
  @Ref() element?: HTMLDivElement;

  @Effect()
  elementClick() {
    const handler = (e: Event) => {
      this.counter = this.counter + 1;
    };
    if (this.props.visible) {
      this.element?.addEventListener("click", handler);
    }

    return () => this.element?.removeEventListener("click", handler);
  }
}
