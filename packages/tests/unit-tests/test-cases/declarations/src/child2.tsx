import {
    Component, ComponentBindings, JSXComponent, React, OneWay, Method,
  } from '@devextreme-generator/declarations';
  
  export const viewFunction = (): JSX.Element => (
    <div />
  );
  
  @ComponentBindings()
  export class Child2ComponentProps {
    @OneWay() someProps = 0;
  }
  
  @Component({
    defaultOptionRules: null,
    view: viewFunction,
  })
  export class Child2Component extends JSXComponent(Child2ComponentProps) {
    @Method()
    twoPlusTwo(): number { return 2 + 2; }
  }