import {
    Component,
    ComponentBindings,
    JSXComponent,
    OneWay,
  } from '@devextreme-generator/declarations';
  
  export const viewFunction = (): JSX.Element => (
    <div>template_component</div>
  );
  
  @ComponentBindings()
  export class TemplateComponentProps {
    @OneWay() props = 0;
  }
  
  @Component({
    defaultOptionRules: null,
    view: viewFunction,
  })
  export class TemplateComponent extends JSXComponent(TemplateComponentProps) {}
