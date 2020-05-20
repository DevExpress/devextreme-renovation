import { Component, ComponentBindings, JSXComponent, OneWay, TwoWay, Effect, Ref } from "../../../component_declaration/common";

function view(model: DefaultOptionRulesComponent) { 
    return <div
        ref={model.host as any}
        {...model.restAttributes}
     >
        <span>{model.props.oneWayProp}</span>
        <span>{model.props.oneWayPropWithDefault}</span>
        <span>{model.props.twoWayProp}</span>
        <span>{model.props.twoWayPropWithDefault}</span>
    </div>;
}

@ComponentBindings()
export class Props { 
    @OneWay() oneWayProp?: string;
    @OneWay() oneWayPropWithDefault?: string = ""
    @TwoWay() twoWayProp?: number;
    @TwoWay() twoWayPropWithDefault?: number = 3;
}

@Component({
    view
})

export default class DefaultOptionRulesComponent extends JSXComponent<Props> {
    @Ref() host: HTMLDivElement;
    @Effect()
    onClick() { 
        const handler = 
        () => {
            this.props.twoWayProp = this.props.twoWayProp + 1;
            this.props.twoWayPropWithDefault = this.props.twoWayPropWithDefault + 1;
        }
        this.host.addEventListener("click", handler);

        return () => this.host.removeEventListener("click", handler);
    }
}
