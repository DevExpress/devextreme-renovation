import {
  Component,
  ComponentBindings,
  JSXComponent,
  ForwardRef,
  OneWay,
  RefObject,
} from "../../../../component_declaration/common";

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
    const nullableRefHtml = nullableRef?.innerHTML;

    if (nullableRef) {
      this.props.nullableRef = this.props.childRef;
    }

    return nullableRefHtml;
  }
}
