import {
    Component,
    ComponentBindings,
    JSXComponent,
    OneWay,
    TwoWay,
    Event,
  } from "@devextreme-generator/declarations";
import Button from "./button";
  
  function view(model: Child) {
    return (
      <div>
          <Button onClick={model.onButtonClick}>AA</Button>
          </div>
    );
  }
  
  @ComponentBindings()
  export class ChildProps {
    @OneWay() prop!: Date;
    @Event() onValueChange: (value: Date) => void = () => null;
  }
  
  @Component({
    view,
    jQuery: {register: true},
  })
  export default class Child extends JSXComponent<ChildProps, "prop">(ChildProps) {
      onButtonClick(){
          this.props.onValueChange(new Date())
      }
  }
  