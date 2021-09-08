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
  export class InheritedFromInfernoComponent extends JSXComponent(SomeProps) {
    @InternalState() _hovered: Boolean = false;
    @Effect()
    someEffect(){

    }
    get someGetter() {
      return this._hovered
    }
  }