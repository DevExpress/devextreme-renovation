import { Effect, Component, ComponentBindings, ForwardRef, InternalState, JSXComponent, Ref, RefObject } from "@devextreme-generator/declarations";
import RefMiddle from './ref-middle';

@ComponentBindings()
export class RefParentProps {}

function view(model:RefParent){
    return (
        <div>
            <div id="refProp" ref={model.refProp}></div>
            <RefMiddle forwardRefProp={model.forwardRefProp} refProp={model.refProp}
            showRefHelper={model.showRefHelper}/>
        </div>
    )
}
@Component({
  view,
  jQuery: {register: true},
})
export default class RefParent extends JSXComponent(RefParentProps) {
    showRefHelper = false;
    @ForwardRef() forwardRefProp?: RefObject<HTMLDivElement>;
    @Ref() refProp?: RefObject<HTMLDivElement>;
    @InternalState() buttonText: string = 'rerender';

    @Effect({run:'once'}) updateShowRefVisibility(){
        this.showRefHelper = true;
    }
}
