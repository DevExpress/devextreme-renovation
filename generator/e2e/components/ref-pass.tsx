import { Component, ComponentBindings, JSXComponent, Effect, Ref, Method } from "../../component_declaration/common";
import RefProps from './ref-props.tsx';

function view({ contentRef }: RefPass) {
    return <div ref={contentRef as any}><RefProps parentRef={contentRef} /></div>;
}

@ComponentBindings()
class Props { }

@Component({
    view
})
export default class RefPass extends JSXComponent(Props) {
    @Ref() contentRef: HTMLDivElement;

    @Effect()
    loadEffect() {
        this.contentRef.innerHTML += "parentText";
    }
}
