import {
    Component,
    Ref,
    ComponentBindings,
    JSXComponent,
    ForwardRef,
    RefObject,
  } from "@devextreme-generator/declarations";
  
  function view(viewModel: Widget) {
    return (
      <div>
        <div 
            someArg1={viewModel.forwardRef?.current}
            someArg2={viewModel.someRef?.current}
            someArg3={viewModel.props?.refProp?.current}
            someArg4={viewModel.props?.forwardRefProp?.current}>            
            </div>
      </div>
    );
  }
  
  @ComponentBindings()
  class WidgetProps {
      @Ref() refProp?: RefObject<HTMLDivElement>;
      @ForwardRef() forwardRefProp?: RefObject<HTMLDivElement>;
  }
  
  @Component({
    view: view,
  })
  export default class Widget extends JSXComponent(WidgetProps) {
    
    @Ref() someRef?: RefObject<HTMLDivElement>;
    @ForwardRef() forwardRef?: RefObject<HTMLDivElement>;
    get forwardRefCurrent() {
        return this.forwardRef?.current;
    }
  }
  