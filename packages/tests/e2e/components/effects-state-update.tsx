import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  InternalState,
  Ref,
  OneWay,
  RefObject,
} from "@devextreme-generator/declarations";
import Button from "./button";

function view(model: EffectsStateUpdate) {
  return (
    <div>
      <Button id={"button-effects-state"} onClick={model.onButtonClick}>
        Effects on State Update
      </Button>
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
}

@Component({
  view,
  jQuery: {register: true},
})
export default class EffectsStateUpdate extends JSXComponent(Props) {
  @Ref() divRef!: RefObject<HTMLDivElement>;
  @InternalState() state1: number = 0;

  @Effect()
  depsEffect() {
    this.divRef.current?.insertAdjacentText(
      "beforeend",
      `(${this.state1} deps)`
    );
  }

  @Effect({ run: "always" })
  alwaysEffect() {
    this.divRef.current?.insertAdjacentText("beforeend", "(always)");
  }

  @Effect({ run: "once" })
  onceEffect() {
    this.divRef.current?.insertAdjacentText(
      "beforeend",
      `(${this.state1} once)`
    );
  }

  onButtonClick() {
    this.state1 = this.state1 + 1;
  }
}
