import { Component, ComponentBindings, JSXComponent, Ref, Effect, Template, Fragment, ForwardRef } from "../../../component_declaration/common";

function view({ props: { contentTemplate: Template }, child }: RefOnChildrenTemplate) { 
    return <Fragment>
        <Template childRef={child} />
    </Fragment>;
}

@ComponentBindings()
class Props { 
    @Template() contentTemplate: any;
}

@Component({
    view
})
export default class RefOnChildrenTemplate extends JSXComponent(Props) {
    @ForwardRef() child: HTMLDivElement;

    @Effect()
    effect(){
        this.child.style.border = "1px solid black";
    }
}
