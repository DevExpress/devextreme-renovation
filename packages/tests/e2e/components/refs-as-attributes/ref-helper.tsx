import { Component, ComponentBindings, JSXComponent, OneWay } from "@devextreme-generator/declarations";

@ComponentBindings()
export class RefHelperProps {
    @OneWay() someRef?: HTMLDivElement | null;
    @OneWay() refProp?: HTMLDivElement | null;
    @OneWay() forwardRef?: HTMLDivElement | null;
    @OneWay() forwardRefProp?: HTMLDivElement | null;
}
function view(model:RefHelper) {
    return (
        <div>
            <div>Ref: {model.props.someRef?.id}</div>
            <div>RefProp: {model.props.refProp?.id}</div>
            <div>ForwardRef: {model.props.forwardRef?.id}</div>
            <div>ForwardRefProp: {model.props.forwardRefProp?.id}</div>
        </div>
    )
}
@Component({view})
export default class RefHelper extends JSXComponent(RefHelperProps) {}
