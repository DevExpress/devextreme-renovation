
        
import { Component, ComponentBindings, JSXComponent, OneWay, InternalState, Fragment } from "../../../component_declaration/common";
import SumArray from "./sum-array.tsx";

function view({ arrayForSum,counter, updated }: SumArrayWrapper) {
    return <Fragment>
        <SumArray
            id="sum-array"
            array={arrayForSum}
            arrayUpdated={updated}
        ></SumArray>
         Updates:<span className={"update-count"}>{counter}</span>
    </Fragment>
}

@ComponentBindings()
export class SumArrayProps { 
    @OneWay() array?: number[];
}

@Component({
    view
})
export default class SumArrayWrapper extends JSXComponent(SumArrayProps) {
    @InternalState() counter: number = 0;

    updated() { 
        this.counter++;
    }

    get arrayForSum(): number[] { 
        return [1, 5, 10];
    }
}
