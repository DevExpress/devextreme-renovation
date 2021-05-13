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
            someArg6={viewModel.props?.refProp?.current}
            someArg7={viewModel.props?.forwardRefProp?.current}>
            
            </div>
      </div>
    //   someArg={viewModel.forwardRef}
    //   someArg2={viewModel.forwardRef?.current}
    //   someArg3={viewModel.forwardRefCurrent}
    //   someArg4={viewModel.someRef}
    //   someArg5={viewModel.someRef?.current}
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
  