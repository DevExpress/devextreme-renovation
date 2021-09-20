import {
    ComponentBindings, JSXTemplate, OneWay, Template,
  } from '@devextreme-generator/declarations';
  import { Child, ChildProps } from './child';
  
  @ComponentBindings()
  export class BetweenProps {
    @Template() childTemplate: JSXTemplate<ChildProps> = Child;
  }
