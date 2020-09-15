import {
  Component,
  ComponentBindings,
  JSXComponent,
  ForwardRef,
  Effect,
  Ref,
} from "../../../component_declaration/common";

function view({ spanRef }: ForwardRefChildAssign) {
  return <span className="forward-ref-child" ref={spanRef as never}></span>;
}

@ComponentBindings()
class Props {
  @ForwardRef() childRef!: HTMLDivElement;
}

@Component({
  view,
})
export default class ForwardRefChildAssign extends JSXComponent<
  Props,
  "childRef"
>() {
  @Ref() spanRef!: HTMLDivElement;

  @Effect()
  effect() {
    this.props.childRef = this.spanRef;
    this.props.childRef.innerHTML += "assignChildText";
  }
}
