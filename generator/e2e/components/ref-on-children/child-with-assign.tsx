import {
  Component,
  ComponentBindings,
  JSXComponent,
  ForwardRef,
  Effect,
  Ref,
  RefObject,
} from "../../../component_declaration/common";

function view({ spanRef }: ForwardRefChildAssign) {
  return <span className="forward-ref-child" ref={spanRef}></span>;
}

@ComponentBindings()
class Props {
  @ForwardRef() childRef!: RefObject<HTMLDivElement>;
}

@Component({
  view,
})
export default class ForwardRefChildAssign extends JSXComponent<
  Props,
  "childRef"
>() {
  @Ref() spanRef!: RefObject<HTMLDivElement>;

  @Effect()
  effect() {
    this.props.childRef = this.spanRef;
    this.props.childRef.innerHTML += "assignChildText";
  }
}
