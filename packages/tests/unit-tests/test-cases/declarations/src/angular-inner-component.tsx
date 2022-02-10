import {
    Component,
    ComponentBindings,
    JSXComponent,
    OneWay,
  } from '@devextreme-generator/declarations';
  
  export const viewFunction = (): JSX.Element => (<div></div>);
  
  @ComponentBindings()
  export class Props {  }
  
  @Component({
    defaultOptionRules: null,
    view: viewFunction,
    angular: { innerComponent: true },
    jQuery: { register: true }
  })
  export class InnerComponent extends JSXComponent(Props) {}
