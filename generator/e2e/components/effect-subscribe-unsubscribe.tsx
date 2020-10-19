import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  InternalState,
  Ref,
} from "../../component_declaration/common";

function view({ buttonRef, contentRef }: EffectSubscribeUnsubscribe) {
  return (
    <div>
      <span
        ref={buttonRef as any}
        style={{
          border: "1px solid black",
        }}
        id="effect-subscribe-unsubscribe-button"
      >
        Update State
      </span>
      :
      <span
        ref={contentRef as any}
        id="effect-subscribe-unsubscribe-button-content"
      ></span>
    </div>
  );
}

@ComponentBindings()
class Props {}

@Component({
  view,
})
export default class EffectSubscribeUnsubscribe extends JSXComponent(Props) {
  @Ref() buttonRef!: HTMLSpanElement;
  @Ref() contentRef!: HTMLSpanElement;
  @InternalState() state1: number = 0;

  @Effect()
  subscribeOnClick() {
    const handler = this.onButtonClick.bind(this);
    this.buttonRef.addEventListener("click", handler);
    return () => this.buttonRef.removeEventListener("click", handler);
  }

  onButtonClick() {
    const value = this.state1;
    this.contentRef.innerHTML = value.toString();
    this.state1 = this.state1 + 1;
  }
}
