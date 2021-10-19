import {
    Component,
    ComponentBindings,
    JSXComponent,
    JSXTemplate,
    Template,
  } from '@devextreme-generator/declarations';
  import InnerWidget, {InnerWidgetProps} from './dx-inner-widget';
  
  export const viewFunction = (): JSX.Element => (
    <div />
  );
  
  @ComponentBindings()
  export class InnerComponentProps {
    @Template() someTemplate: JSXTemplate<InnerWidgetProps> = InnerWidget;
  }
  
  @Component({
    defaultOptionRules: null,
    view: viewFunction,
  })
  export class InnerComponent extends JSXComponent(InnerComponentProps) {}
