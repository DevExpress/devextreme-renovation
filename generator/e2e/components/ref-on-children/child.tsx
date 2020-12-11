import {
  Component,
  ComponentBindings,
  JSXComponent,
  ForwardRef,
  Effect,
  RefObject,
} from "../../../component_declaration/common";

function view({ props: { childRef } }: ForwardRefChild) {
  return <span className="forward-ref-child" ref={childRef}></span>;
}

@ComponentBindings()
class Props {
  @ForwardRef() childRef!: RefObject<HTMLDivElement>;
}

@Component({
  view,
})
export default class ForwardRefChild extends JSXComponent<Props, "childRef">() {
  @Effect()
  effect() {
    this.props.childRef.innerHTML += "childText";
  }
}
