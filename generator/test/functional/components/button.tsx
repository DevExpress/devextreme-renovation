import { Component, ComponentBindings, JSXComponent, Event, Slot, Effect, Ref, OneWay } from "../../../component_declaration/common";

function view(model: Button) { 
    return <div
        id={model.props.id}
        ref={model.host as any} style={{ 
        border: "1px solid black",
        padding: 10,
        display: "inline-block"
        }}>{
            model.props.children ? model.props.children : "Default Text"
        }</div>;
}

@ComponentBindings()
export class ButtonInput { 
    @Event() onClick?: (e: Event) => void;
    @Slot() children?: any; 
    @OneWay() id?: string;
}

@Component({
    view
})

export default class Button extends JSXComponent<ButtonInput> {
    @Ref() host: HTMLDivElement;

    @Effect() clickEffect() { 
        const handler = (e) => {
            this.props.onClick?.(e);
        };
        this.host.addEventListener("click", handler);

        return () => this.host.removeEventListener("click", handler);
    }
}
