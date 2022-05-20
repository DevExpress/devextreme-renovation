import {
    Component,
    ComponentBindings,
    JSXComponent,
    Effect,
  } from "@devextreme-generator/declarations";
  
  function view(model: ChildB) {
    return <div>ChildB</div>;
  }
  
  @ComponentBindings()
  class Props {}
  
  @Component({
    view,
    jQuery: {register: true},
  })
  export default class ChildB extends JSXComponent(Props) {
      @Effect()
      effectB(){
        console.log('childB');
      }
  }
  