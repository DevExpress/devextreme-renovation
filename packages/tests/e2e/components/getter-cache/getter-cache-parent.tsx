import {
    Component,
    ComponentBindings,
    JSXComponent,
    InternalState, 
    Provider,
  } from "@devextreme-generator/declarations";

  import ConsumerComp from "./consumer-comp"
  import {NumberContext, NumberContextType} from "../context/context";
  import ButtonComponent from "../button";

  function view(model: GetterCacheParent) {
    return (
      <div>
        Cached Getters
        <ConsumerComp numProp={model.numProp}></ConsumerComp>
        <ButtonComponent onClick={model.increaseProp}>Increase Prop value</ButtonComponent>
      </div>
    );
  }
  
  @ComponentBindings()
  class GetterCacheParentProps {
  }
  
  @Component({
    view,
  })
  export default class GetterCacheParent extends JSXComponent(GetterCacheParentProps) {
    @InternalState() numState = 2;
    @InternalState() numProp = 0;
    @Provider(NumberContext)
    get numberContextProvider():NumberContextType {
      return {counter: this.numState, increaseCounter: () => {this.numState = this.numState + 1}}
    }
    increaseProp(){
      this.numProp += 1;
    }
  }