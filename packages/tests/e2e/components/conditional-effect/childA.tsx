import {
    Component,
    ComponentBindings,
    JSXComponent,
    Effect,
  } from "@devextreme-generator/declarations";
  
  function view(model: ButtonTemplate) {
    return <div>ChildA</div>;
  }
  
  @ComponentBindings()
  class Props {}
  
  @Component({
    view,
    jQuery: {register: true},
  })
  export default class ButtonTemplate extends JSXComponent(Props) {
      @Effect()
      effectA(){
        console.log('effectA');
      }
  }
  