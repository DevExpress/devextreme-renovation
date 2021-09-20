import {
    Component,
    ComponentBindings,
    JSXComponent,
    OneWay,
  } from '@devextreme-generator/declarations';
  
  export const viewFunction = (): JSX.Element => (<div>
    Child
  </div>);
  
  @ComponentBindings()
  export class ChildProps {
    @OneWay() number = 3;
  }
  
  @Component({
    defaultOptionRules: null,
    view: viewFunction,
  })
  export class Child extends JSXComponent(ChildProps) {}