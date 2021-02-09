import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  Ref,
  OneWay,
  RefObject,
} from "../../component_declaration/common";

function view(model: EffectsDOMUpdate) {
  return (
    <div>
      <span>{model.props.text}</span>
      <div
        id={model.props.name}
        ref={model.divRef}
        style={{ backgroundColor: "#b3b3b3" }}
      ></div>
    </div>
  );
}

@ComponentBindings()
class Props {
  @OneWay() name?: string;
  @OneWay() text!: string;
}

@Component({
  view,
})
export default class EffectsDOMUpdate extends JSXComponent<Props, "text">() {
  @Ref() divRef!: RefObject<HTMLDivElement>;

  @Effect()
  noDepsEffect() {
    this.divRef.current?.insertAdjacentText("beforeend", `(no deps)`);
  }

  @Effect()
  depsEffect() {
    this.divRef.current?.insertAdjacentText(
      "beforeend",
      `(${this.props.text} deps)`
    );
  }

  @Effect({ run: "always" })
  alwaysEffect() {
    this.divRef.current?.insertAdjacentText("beforeend", "(always)");
  }

  @Effect({ run: "once" })
  onceEffect() {
    this.divRef.current?.insertAdjacentText("beforeend", `(once)`);
  }
}
