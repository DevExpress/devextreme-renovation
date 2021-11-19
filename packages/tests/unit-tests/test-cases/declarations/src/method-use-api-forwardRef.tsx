import {
    Component, ComponentBindings, JSXComponent, React, ForwardRef, RefObject, Effect,
  } from '@devextreme-generator/declarations';
  import BaseWidget from './method';
  
  export const viewFunction = ({
    props: { forwardedRef },
  }: Child1Component): JSX.Element => (
    <BaseWidget
      ref={forwardedRef}
    />
  );
  
  @ComponentBindings()
  export class Child1ComponentProps {
    @ForwardRef() forwardedRef!: RefObject<BaseWidget>;
  }
  
  @Component({
    defaultOptionRules: null,
    view: viewFunction,
  })
  export class Child1Component extends JSXComponent<Child1ComponentProps, 'forwardedRef'>() {
    @Effect({ run: 'once' })
    twoPlusTwoEffect(): void {
      console.log(this.props.forwardedRef.current!.getSize());
    }
    get someGetter(): Partial<Child1ComponentProps>{
      return {}
    }
  }