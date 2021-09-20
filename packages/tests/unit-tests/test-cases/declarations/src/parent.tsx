import {
    Component,
    ComponentBindings,
    JSXComponent,
    Template,
    JSXTemplate,
    OneWay
  } from '@devextreme-generator/declarations';
  import { BetweenProps } from './between_props';
  
  export const viewFunction = ({ props: { childTemplate: ChildTemplate} }: Parent):
  JSX.Element => (
    <div>
      Parent
      <ChildTemplate />
    </div>
  );
  
  @Component({
    defaultOptionRules: null,
    view: viewFunction,
  })
  export class Parent extends JSXComponent(BetweenProps) {}