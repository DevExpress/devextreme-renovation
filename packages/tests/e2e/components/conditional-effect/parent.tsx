import {
    Component,
    ComponentBindings,
    JSXComponent,
    InternalState,
    Fragment,
    Effect,
  } from "@devextreme-generator/declarations";
  
  import Button from "../button";
  import ChildA from "./childA";
  import ChildB from "./childB";
  function view(model: ConditionalEffectParent) {
    return (<Fragment>
            <Button onClick={model.changeCondition}>Change conition</Button>
            {model.condition ? <ChildA/> : <ChildB/>}
        </Fragment>);
  }
  
  @ComponentBindings()
  class Props {}
  
  @Component({
    view,
    jQuery: {register: true},
  })
  export default class ConditionalEffectParent extends JSXComponent(Props) {
      @InternalState() condition = true;

      changeCondition(){
          this.condition = !this.condition;
      }
      @Effect()
      parent(){
          console.log("parent", this.condition);
      }
  }
  