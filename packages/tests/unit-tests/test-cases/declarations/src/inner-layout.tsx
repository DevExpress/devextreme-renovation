import {
    Component,
    ComponentBindings,
    JSXComponent,
    JSXTemplate,
    Template,
  } from '@devextreme-generator/declarations';
  import { InnerComponent, InnerComponentProps } from './inner-component';
  
  export const viewFunction = (): JSX.Element => (
    <div />
  );
  
  @ComponentBindings()
  export class InnerLayoutProps {
    @Template() innerComponentTemplate: JSXTemplate<InnerComponentProps> = InnerComponent;
  }
  
  @Component({
    defaultOptionRules: null,
    view: viewFunction,
  })
  export class InnerLayout extends JSXComponent(InnerLayoutProps) {}
