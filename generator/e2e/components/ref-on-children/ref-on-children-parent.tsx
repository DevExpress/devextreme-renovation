import { Component, ComponentBindings, JSXComponent, Ref, Effect, ForwardRef } from "../../../component_declaration/common";
import Child from "./child.tsx";

function view({ child }: RefOnChildrenParent) { 
    return <Child childRef={child}/>
}

@ComponentBindings()
class Props { 
   
}

@Component({
    view
})
export default class RefOnChildrenParent extends JSXComponent(Props) {
    @ForwardRef() child: HTMLDivElement;

    @Effect()
    effect(){
        this.child.innerHTML+= "ParentText";
    }
}
