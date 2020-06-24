import { Component, ComponentBindings, JSXComponent, Effect, ForwardRef } from "../../../component_declaration/common";
import Child from "./child.tsx";

function view({ child }: ForwardRefParent) { 
    return <Child childRef={child}/>
}

@ComponentBindings()
class Props { 
   
}

@Component({
    view
})
export default class ForwardRefParent extends JSXComponent(Props) {
    @ForwardRef() child: HTMLDivElement;

    @Effect()
    effect(){
        this.child.style.backgroundColor = "rgb(120, 120, 120)";
    }
}
