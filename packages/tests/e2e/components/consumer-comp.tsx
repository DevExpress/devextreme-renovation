import {
    Component,
    ComponentBindings,
    JSXComponent,
    Consumer
  } from "@devextreme-generator/declarations";
  import {NumberContext, NumberContextType} from "./context/context";
  import ButtonComponent from "./button";
  function view(model: ConsumerComp) {
    return (
      <div>
        {model.somethingToRender}
        {model.complexGetter}
        <ButtonComponent onClick={model.onButtClick}/>
        
      </div>
    );
  }
  @ComponentBindings()
  class ConsumerCompProps {
  }
  
  @Component({
    view,
  })
  export default class ConsumerComp extends JSXComponent(ConsumerCompProps) {
    @Consumer(NumberContext)
    numberContextConsumer!: NumberContextType;
    onButtClick(){
      this.numberContextConsumer.increaseCounter()
      console.log(this.numberContextConsumer.counter)
    }
    get somethingToRender(): number{
        const counter = this.numberContextConsumer?.counter
        return counter ? counter : 0;
    }
    get complexGetter(): number[] {
      return [this.numberContextConsumer?.counter]
    }
  }
  