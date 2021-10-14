import {
    Component,
    ComponentBindings,
    JSXComponent,
    JSXTemplate,
    Template,
  } from '@devextreme-generator/declarations';
  import { TemplateComponent, TemplateComponentProps } from './template_component';
  
  export const viewFunction = (): JSX.Element => (
    <div />
  );
  
  @ComponentBindings()
  export class InnerComponentProps {
    @Template() someTemplate: JSXTemplate<TemplateComponentProps> = TemplateComponent;
  }
  
  @Component({
    defaultOptionRules: null,
    view: viewFunction,
  })
  export class InnerComponent extends JSXComponent(InnerComponentProps) {}
