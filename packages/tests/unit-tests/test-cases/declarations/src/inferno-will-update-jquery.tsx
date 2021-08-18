import {
    Component,
    InternalState,
    JSXComponent,
    Effect,
    ComponentBindings,
  } from "@devextreme-generator/declarations";
  
  @ComponentBindings() 
  class SomeProps{}
  function view() {
    return <span></span>;
  }
@Component({
    view,
    jQuery: { register: true },
  })
  export class InheritedFromInfernoWrapperComponent extends JSXComponent(SomeProps) {
    @InternalState() _hovered: Boolean = false;
  
    get someGetter() {
      return this._hovered
    }
  }