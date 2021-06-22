import {
    Component,
    ComponentBindings,
    JSXComponent,
    OneWay,
    InternalState, 
    createContext,
    Provider,
    Consumer
  } from "@devextreme-generator/declarations";

  import ConsumerComp from "./consumer-comp"
  import {NumberContext, NumberContextType} from "./context/context";

  function view(model: TestComponent) {
    return (
      <div>
        <ConsumerComp></ConsumerComp>
        
      </div>
    );
  }
  
  @ComponentBindings()
  class TestComponentProps {
    @OneWay() numProp = 2;
  }
  
  @Component({
    view,
  })
  export default class TestComponent extends JSXComponent(TestComponentProps) {
    @InternalState() numState = 2;
    @Provider(NumberContext)
    get numberContextProvider():NumberContextType {
      return {counter: this.numState, increaseCounter: () => {this.numState = this.numState + 1}}
    }
  }