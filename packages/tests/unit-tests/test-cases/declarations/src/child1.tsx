import {
    Component, ComponentBindings, JSXComponent, React, ForwardRef, RefObject, Effect,
  } from '@devextreme-generator/declarations';
  import { Child2Component } from './child2';
  
  export const viewFunction = ({
    props: { forwardedRef },
  }: Child1Component): JSX.Element => (
    <Child2Component
      ref={forwardedRef}
    />
  );
  
  @ComponentBindings()
  export class Child1ComponentProps {
    @ForwardRef() forwardedRef!: RefObject<Child2Component>;
  }
  
  @Component({
    defaultOptionRules: null,
    view: viewFunction,
  })
  export class Child1Component extends JSXComponent<Child1ComponentProps, 'forwardedRef'>() {
    @Effect({ run: 'once' })
    twoPlusTwoEffect(): void {
      console.log(this.props.forwardedRef.current!.twoPlusTwo());
    }
    get someGetter(): Partial<Child1ComponentProps>{
      return {}
    }
  }