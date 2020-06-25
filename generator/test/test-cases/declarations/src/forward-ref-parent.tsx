import { Component, ComponentBindings, JSXComponent, Effect, ForwardRef } from "../../../../component_declaration/common";
import Child from "./forward-ref-child";

function view({ child, props: {nullableRef} }: RefOnChildrenParent) { 
    return <Child childRef={child} nullableRef={nullableRef} />;
}

@ComponentBindings()
class Props { 
    @ForwardRef() nullableRef?: HTMLDivElement;
}

@Component({
    view
})
export default class RefOnChildrenParent extends JSXComponent(Props) {
    @ForwardRef() child!: HTMLDivElement;

    @Effect()
    effect(){
        this.child.innerHTML = "Ref from child";
        const html = this.props.nullableRef?.innerHTML;
    }
}
