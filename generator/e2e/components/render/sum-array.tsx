import { Component, ComponentBindings, JSXComponent, OneWay, Effect, InternalState, Ref } from "../../../component_declaration/common";

function view({ sum, restAttributes, counterRef }: SumArray) {
    return <div
        {...restAttributes}
    >
        Sum: <span className={"sum"}>{sum}</span><br />
        Updates:<span ref={counterRef as any} className={"update-count"}>0</span>
    </div>
}

@ComponentBindings()
export class SumArrayProps {
    @OneWay() array?: number[];
}

@Component({
    view
})
export default class SumArray extends JSXComponent(SumArrayProps) {
    @Ref() counterRef!: HTMLDivElement;

    @Effect()
    arrayUpdated() {
        if (this.props.array) {
            this.counterRef.innerText = (Number(this.counterRef.innerText) + 1).toString();
        }
    }

    get sum(): string {
        return (this.props.array || []).reduce((sum, i) => sum + i, 0).toString();
    }
}
