import { Component, ComponentBindings, JSXComponent, ForwardRef, Effect } from "../../../component_declaration/common";

function view({ props: { childRef} }: ForwardRefChild) { 
    return (<span
        className="forward-ref-child"
        ref={childRef as never}>
    </span>);
}

@ComponentBindings()
class Props { 
    @ForwardRef() childRef: HTMLDivElement;
}

@Component({
    view
})
export default class ForwardRefChild extends JSXComponent(Props) {
    @Effect()
    effect(){
        this.props.childRef.innerHTML+= "childText";
    }
}
