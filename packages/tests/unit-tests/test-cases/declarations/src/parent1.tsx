import {
    Component, ComponentBindings, JSXComponent, OneWay, React, ForwardRef, RefObject, Effect,
  } from '@devextreme-generator/declarations';
  import { Child1Component } from './child1';
  import { Child2Component } from './child2';
  
  export const viewFunction = ({
    forwardedRef,
  }: ParentComponent): JSX.Element => (
    <Child1Component
      forwardedRef={forwardedRef}
    />
  );
  
  @ComponentBindings()
  export class ParentComponentProps {
    @OneWay() someProp = 0;
  }
  
  @Component({
    defaultOptionRules: null,
    view: viewFunction,
  })
  export class ParentComponent extends JSXComponent(ParentComponentProps) {
    @ForwardRef()
    forwardedRef!: RefObject<Child2Component>;
  
    @Effect({ run: 'once' })
    twoPlusTwoEffect(): void {
      console.log(this.forwardedRef.current!.twoPlusTwo());
    }
  }