import {
  Component,
  ComponentBindings,
  JSXComponent,
  ForwardRef,
  OneWay,
  RefObject,
} from "@devextreme-generator/declarations";

function view({ props: { childRef, nullableRef } }: RefOnChildrenChild) {
  return (
    <div ref={childRef}>
      <div ref={nullableRef}></div>
    </div>
  );
}

@ComponentBindings()
class Props {
  @ForwardRef() childRef!: RefObject<HTMLDivElement>;
  @ForwardRef() nullableRef?: RefObject<HTMLDivElement>;
  @OneWay() state?: number;
}

@Component({
  view,
})
export default class RefOnChildrenChild extends JSXComponent<
  Props,
  "childRef"
>() {
  method() {
    const { nullableRef } = this.props;
    const nullableRefHtml = nullableRef?.current?.innerHTML;

    if (nullableRef) {
      nullableRef.current = this.props.childRef.current;
    }

    return nullableRefHtml;
  }
}
