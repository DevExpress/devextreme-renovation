import {
    Component,
    ForwardRef,
    InternalState,
    Method,
    Mutable,
    Ref,
  } from "@devextreme-generator/declarations";
  
  function view(model: Widget) {
    return <span></span>;
  }
  
  @Component({
    view,
  })
  export default class Widget {
    @Mutable() mutable = false;
  
    @Method() updateMutable(mutable: boolean) {
      this.mutable = mutable;
    }
  }
  