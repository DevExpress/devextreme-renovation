import { Component, ComponentBindings, JSXComponent, OneWay, Event, Effect, Ref, InternalState } from "../../../component_declaration/common";

function view({ sum, updatesCount, restAttributes }: SumArray) { 
    return <div
        {...restAttributes}
    >
        Sum: <span className={"sum"}>{sum}</span><br />
        Updates:<span className={"update-count"}>{updatesCount}</span>
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
    @InternalState()
    updatesCount = 0;

    @Effect()
    arrayUpdated() { 
        if (this.props.array) { 
            this.updatesCount++;
        }
    }

    get sum(): string { 
        return (this.props.array || []).reduce((sum, i) => sum + i, 0).toString();
    }
}
