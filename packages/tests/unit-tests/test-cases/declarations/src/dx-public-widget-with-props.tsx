import {
    Component,
    ComponentBindings,
    JSXComponent,
    OneWay,
    Method,
    Event,
  } from "@devextreme-generator/declarations";
  
  function view({ props: { value, optionalValue } }: PublicWidgetWithProps) {
    return <div>{optionalValue || value}</div>;
  }
  
  @ComponentBindings()
  export class WidgetWithPropsInput {
    @OneWay() value = "default text";
    @OneWay() optionalValue?: string;
    @OneWay() number? = 42;
    @Event() onClick?: (e: any) => void;
  }
    
  @Component({
    view: view,
    jQuery: {register: true }
  })
  export class PublicWidgetWithProps extends JSXComponent(WidgetWithPropsInput) {
    @Method()
    doSomething() {}
  }
  
  