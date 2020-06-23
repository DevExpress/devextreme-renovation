import { Component, ComponentBindings, JSXComponent, Ref, Effect, Template, Fragment } from "../../../../component_declaration/common";

function view(model: RefOnChildrenTemplate) { 
    return <Fragment><model.props.contentTemplate childRef={model.child}></model.props.contentTemplate></Fragment>
}

@ComponentBindings()
class Props { 
    @Template() contentTemplate: any;
}

@Component({
    view
})
export default class RefOnChildrenTemplate extends JSXComponent(Props) {
    @Ref() child: HTMLDivElement;

    @Effect()
    effect(){
        this.child.innerHTML+= "ParentText";
    }
}
