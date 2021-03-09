import {
  Component,
  ComponentBindings,
  JSXComponent,
  InternalState,
  Ref,
  Effect,
  RefObject,
} from "../../component_declaration/common";
import ButtonComponent from "./button";

function view(model: VisibilityChange) {
  return (
    <div>
      <ButtonComponent
        id="change-visibility-open-element"
        onClick={model.clickHandler}
      >
        {"Change visibility"}
      </ButtonComponent>
      {model.visible ? (
        <div
          id={"change-visibility-hide-element"}
          ref={model.element}
          style={{
            width: 100,
            height: 20,
            backgroundColor: "green",
          }}
        ></div>
      ) : null}
    </div>
  );
}

@ComponentBindings()
class WidgetInput {}

@Component({
  view,
})
export default class VisibilityChange extends JSXComponent(WidgetInput) {
  @InternalState() visible: boolean = false;
  @Ref() element?: RefObject<HTMLDivElement>;

  @Effect()
  elementClick() {
    const handler = (e: Event) => {
      this.visible = false;
    };
    if (this.visible) {
      this.element?.current?.addEventListener("click", handler);
    }

    return () => this.element?.current?.removeEventListener("click", handler);
  }

  clickHandler() {
    this.visible = !this.visible;
  }
}
