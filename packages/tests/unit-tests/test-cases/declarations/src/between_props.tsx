import {
    ComponentBindings, JSXTemplate, Template,
  } from '@devextreme-generator/declarations';
  import { Child, ChildProps } from './child';

  @ComponentBindings()
  export class BetweenProps {
    @Template() childTemplate: JSXTemplate<ChildProps> = Child;
  }
