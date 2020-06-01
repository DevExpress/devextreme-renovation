import { Component, ComponentBindings, JSXComponent, OneWay, TwoWay } from "../../../component_declaration/common";
import Button from "./button.tsx"

function view(model: Counter) { 
    return <Button id={model.props.id} onClick={model.onClick}>{model.props.value}</Button>;
}

@ComponentBindings()
export class CounterInput { 
    @OneWay() id?: string;
    @TwoWay() value?: number;
}

@Component({
    view
})
export default class Counter extends JSXComponent(CounterInput) {
    onClick() {
        this.props.value = this.props.value + 1;
    }
}
