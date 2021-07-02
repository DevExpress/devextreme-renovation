import {
    Component,
    ComponentBindings,
    JSXComponent,
    Consumer,
    OneWay,
    InternalState
  } from "@devextreme-generator/declarations";
  import {NumberContext, NumberContextType} from "../context/context";
  import ButtonComponent from "../button";
  function view(model: ConsumerComp) {
    return (
      <div>
        {model.counter}
        {model.renderArray}
        {model.renderObject}
        <ButtonComponent onClick={model.increaseContext}>Increase Context value</ButtonComponent>
        <ButtonComponent onClick={model.increaseState}>Increase State value</ButtonComponent>
      </div>
    );
  }
  @ComponentBindings()
  class ConsumerCompProps {
    @OneWay() numProp: number = 0;
  }
  
  @Component({
    view,
  })
  export default class ConsumerComp extends JSXComponent(ConsumerCompProps) {
    @InternalState() numState = 0;
    @Consumer(NumberContext)
    numberContextConsumer!: NumberContextType;
    increaseContext(){
      this.numberContextConsumer.increaseCounter()
    }
    increaseState(){
      this.numState += 1;
    }
    get counter(): number{
        const counter = this.numberContextConsumer?.counter
        return counter ? counter : 0;
    }
    get arrayGetter(): number[] {
      return [this.props.numProp, this.numState, this.numberContextConsumer?.counter]
    }
    get objectGetter(): {propNumber: number, stateNumber: number, contextNumber: number} {
      return { 
        propNumber: this.props.numProp, 
        stateNumber: this.numState, 
        contextNumber: this.numberContextConsumer?.counter || 0 
      }
    }
    get renderArray(): string{
      return this.arrayGetter.map(String).join(' ')
    }
    get renderObject(): string {
      return Object.values(this.objectGetter).join(' ')
    }
  }
  