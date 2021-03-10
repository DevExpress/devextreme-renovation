import {
  Component,
  OneWay,
  ComponentBindings,
  JSXComponent,
  InternalState,
  Ref,
  Effect,
  RefObject,
} from "@devextreme-generator/declaration";

function view(model: VisibilityChangeProp) {
  return (
    <div style={{ paddingTop: 10 }}>
      {model.props.visible ? (
        <div
          id={"change-visibility-prop-element"}
          ref={model.element}
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
  @Ref() element?: RefObject<HTMLDivElement>;

  @Effect()
  elementClick() {
    const handler = (e: Event) => {
      this.counter = this.counter + 1;
    };
    if (this.props.visible) {
      this.element?.current?.addEventListener("click", handler);
    }

    return () => this.element?.current?.removeEventListener("click", handler);
  }
}
