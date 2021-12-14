import {
    Component,
    Ref,
    ComponentBindings,
    JSXComponent,
    ForwardRef,
    RefObject,
    OneWay,
  } from "@devextreme-generator/declarations";
import HelperWidget from './refs-as-attribute-helper'
@ComponentBindings()
class WidgetProps {
    @Ref() refProp?: RefObject<HTMLDivElement>;
    @ForwardRef() forwardRefProp?: RefObject<HTMLDivElement>;
}

function view(model: Widget) {
  return (
    <div>
      <HelperWidget 
          forwardRef={model.forwardRef?.current}
          someRef={model.someRef?.current}
          refProp={model.props?.refProp?.current}
          forwardRefProp={model.props?.forwardRefProp?.current}>            
      </HelperWidget>
    </div>
  );
}
@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetProps) {
  
  @Ref() someRef!: RefObject<HTMLDivElement>;
  @ForwardRef() forwardRef!: RefObject<HTMLDivElement>;
  get forwardRefCurrent() {
      return this.forwardRef?.current;
  }
}
