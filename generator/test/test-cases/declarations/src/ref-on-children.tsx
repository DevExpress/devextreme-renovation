import { Component, ComponentBindings, JSXComponent, Ref, Effect } from "../../../../component_declaration/common";
import Child from "./child";

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
    @Ref() child!: HTMLDivElement;

    @Effect()
    effect(){
        this.child.innerHTML = "Ref from child";
    }
    
}
