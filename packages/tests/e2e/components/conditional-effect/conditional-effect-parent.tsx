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
            stateA {model.stateA}, stateB {model.stateB} 
        </Fragment>);
  }
  
  @ComponentBindings()
  export class ConditionalParentProps {}
  
  @Component({
    view,
    jQuery: {register: true},
  })
  export default class ConditionalEffectParent extends JSXComponent(ConditionalParentProps) {
      @InternalState() condition = true;

      @InternalState() stateA = 0;
      @InternalState() stateB = 0;
      changeCondition(){
          this.condition = !this.condition;
      }
      @Effect()
      parent(){
          console.log("parent", this.condition);
      }

      @Effect({run: "always"})
      effectA(){
        if(this.stateB < 5){
          this.stateB += 1
        }
      }

      @Effect({run: "always"})
      effectB(){
        this.stateA = this.stateB
      }
  }
  