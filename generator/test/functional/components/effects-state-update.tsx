import { Component, ComponentBindings, JSXComponent, Effect, InternalState, Ref, OneWay } from "../../../component_declaration/common";
import Button from "./button.tsx"

function view(model: EffectsStateUpdate) { 
    return <div>
        <Button onClick={model.onButtonClick}>Effects on State Update</Button>
        <div id={model.props.id} ref={model.divRef as any} style={{ backgroundColor: "#b3b3b3" }}></div>
    </div>;
}

@ComponentBindings()
class Props { 
    @OneWay() id?: string;
}

@Component({
    view
})
export default class EffectsStateUpdate extends JSXComponent(Props) {
    @Ref() divRef: HTMLDivElement;
    @InternalState() state1: number = 0;

    @Effect()
    depsEffect() {
        this.divRef.insertAdjacentText("beforeend", `(${this.state1} deps)`);
    }

    @Effect({ run: "always" })
    alwaysEffect() {
        this.divRef.insertAdjacentText("beforeend", "(always)");
    }

    @Effect({ run: "once" })
    onceEffect() {
        this.divRef.insertAdjacentText("beforeend", `(${this.state1} once)`);
    }

    onButtonClick() {
        this.state1 = this.state1 + 1
    }
}
