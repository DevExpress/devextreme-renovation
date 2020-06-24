import { Component, ComponentBindings, JSXComponent, OneWay, ForwardRef, Effect } from "../../../component_declaration/common";


function view({ props: { childRef} }: ForwardRefChild) { 
    return <div ref={childRef as never}></div>
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
