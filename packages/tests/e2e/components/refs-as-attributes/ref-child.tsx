import { Component, ComponentBindings, ForwardRef, JSXComponent, RefObject } from "@devextreme-generator/declarations";

@ComponentBindings()
export class RefChildProps {
    @ForwardRef() forwardRef?: RefObject<HTMLDivElement>;
}
function view(model:RefChild){
    return (
        <div id="forwardRef" ref={model.props.forwardRef}>
        </div>
    )
}
@Component({view, jQuery: {register: true},})
export default class RefChild extends JSXComponent(RefChildProps) {}
