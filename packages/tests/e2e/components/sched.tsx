import {
    Component,
    ComponentBindings,
    JSXComponent,
    OneWay,
    TwoWay,
    Event,
  } from "@devextreme-generator/declarations";
  import ChildComponent from "./child-component";
  
  function view(model: Shed) {
    return (
        <div>
            <ChildComponent prop={model.value.value} onValueChange={model.onValueChange} />
            {model.props.value.toLocaleString()}
        </div>
    );
  }
  
  @ComponentBindings()
  export class CounterInput {
    @TwoWay() value: Date = new Date();
  }
  
  @Component({
    view,
    jQuery: {register: true},
  })
  export default class Shed extends JSXComponent(CounterInput) {
      get value(): {value: Date}{
          return {value: this.props.value} 
      }
      onValueChange(value: Date){
          this.props.value = value
      }
  }
  