import { Component, ComponentBindings, Effect, ForwardRef, JSXComponent, OneWay, Ref, RefObject } from "@devextreme-generator/declarations";
import RefChild from './ref-child';
import RefHelper from './ref-helper';

@ComponentBindings()
export class RefMiddleProps {
    @Ref() refProp?: RefObject<HTMLDivElement>;
    @ForwardRef() forwardRefProp?: RefObject<HTMLDivElement>;
    @OneWay() showRefHelper?: boolean;
}
function view(model:RefMiddle){
    
    return (
        <div id="forwardRefProp" ref={model.props.forwardRefProp}>
            <div id="ref" ref={model.middleDivRef}></div>
            <RefChild forwardRef={model.forwardRef}/>
            { model.props.showRefHelper && <RefHelper 
                someRef={model.middleDivRef?.current}
                refProp={model.props.refProp?.current}
                forwardRef={model.forwardRef?.current}
                forwardRefProp={model.props.forwardRefProp?.current}
                />}
        </div>
    )
}
@Component({view})
export default class RefMiddle extends JSXComponent(RefMiddleProps) {
    @Ref() middleDivRef?: RefObject<HTMLDivElement>;
    @ForwardRef() forwardRef?: RefObject<HTMLDivElement>;    
}
