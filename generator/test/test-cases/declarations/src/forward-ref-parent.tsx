import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  ForwardRef,
  InternalState,
  RefObject,
} from "../../../../component_declaration/common";
import Child from "./forward-ref-child";

function view({
  child,
  props: { nullableRef },
  innerState,
}: RefOnChildrenParent) {
  return (
    <Child childRef={child} nullableRef={nullableRef} state={innerState} />
  );
}

@ComponentBindings()
class Props {
  @ForwardRef() nullableRef?: RefObject<HTMLDivElement>;
}

@Component({
  view,
})
export default class RefOnChildrenParent extends JSXComponent(Props) {
  @ForwardRef() child!: RefObject<HTMLDivElement>;
  @InternalState() innerState: number = 10;

  @Effect()
  effect() {
    this.child.innerHTML = "Ref from child";
    const html = this.props.nullableRef?.innerHTML;
  }
}
