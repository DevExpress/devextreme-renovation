import {
  Component,
  ComponentBindings,
  JSXComponent,
  Event,
  Slot,
  Effect,
  Ref,
  OneWay,
  RefObject,
} from "@devextreme-generator/declarations";

function view(model: Button) {
  return (
    <div
      id={model.props.id}
      ref={model.host}
      style={{
        border: "1px solid black",
        padding: 10,
        display: "inline-block",
      }}
    >
      {model.props.children ? model.props.children : "Default Text"}
    </div>
  );
}

@ComponentBindings()
export class ButtonInput {
  @Event() onClick?: (e: Event) => void;
  @Slot() children?: any;
  @OneWay() id?: string;
}

@Component({
  view,
  jQuery: {register: true},
})
export default class Button extends JSXComponent(ButtonInput) {
  @Ref() host!: RefObject<HTMLDivElement>;

  @Effect() clickEffect() {
    const handler = (e: Event) => {
      this.props.onClick?.(e);
    };
    this.host.current?.addEventListener("click", handler);

    return () => this.host.current?.removeEventListener("click", handler);
  }
}
