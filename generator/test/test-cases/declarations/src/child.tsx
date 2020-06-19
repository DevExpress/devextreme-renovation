import { Component, ComponentBindings, JSXComponent, ForwardRef } from "../../../../component_declaration/common";


function view({ props: { childRef } }: RefOnChildrenChild) { 
return <div ref={childRef as any}></div>
}

@ComponentBindings()
class Props { 
   @ForwardRef() childRef!: HTMLDivElement;
}

@Component({
    view
})
export default class RefOnChildrenChild extends JSXComponent(Props) {
    
}
