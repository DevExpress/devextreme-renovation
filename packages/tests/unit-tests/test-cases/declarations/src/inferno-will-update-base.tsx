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
  })
  export default class InheritedFromBaseComponent extends JSXComponent(SomeProps) {
    @InternalState() _hovered: Boolean = false;
  
    updateState() {
      this._hovered = !this._hovered;
    }
  }
  
  

 
  