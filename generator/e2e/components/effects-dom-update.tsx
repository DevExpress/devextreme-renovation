import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  Ref,
  OneWay,
} from "../../component_declaration/common";

function view(model: EffectsDOMUpdate) {
  return (
    <div>
      <span>{model.props.text}</span>
      <div
        id={model.props.name}
        ref={model.divRef as any}
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
  @Ref() divRef!: HTMLDivElement;

  @Effect()
  noDepsEffect() {
    this.divRef.insertAdjacentText("beforeend", `(no deps)`);
  }

  @Effect()
  depsEffect() {
    this.divRef.insertAdjacentText("beforeend", `(${this.props.text} deps)`);
  }

  @Effect({ run: "always" })
  alwaysEffect() {
    this.divRef.insertAdjacentText("beforeend", "(always)");
  }

  @Effect({ run: "once" })
  onceEffect() {
    this.divRef.insertAdjacentText("beforeend", `(once)`);
  }
}
