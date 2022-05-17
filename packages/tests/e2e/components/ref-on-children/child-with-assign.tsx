import {
  Component,
  ComponentBindings,
  JSXComponent,
  ForwardRef,
  Effect,
  Ref,
  RefObject,
} from "@devextreme-generator/declarations";

function view({ spanRef }: ForwardRefChildAssign) {
  return <span className="forward-ref-child" ref={spanRef}></span>;
}

@ComponentBindings()
class Props {
  @ForwardRef() childRef!: RefObject<HTMLDivElement>;
}

@Component({
  view,
  jQuery: {register: true},
})
export default class ForwardRefChildAssign extends JSXComponent<
  Props,
  "childRef"
>() {
  @Ref() spanRef!: RefObject<HTMLDivElement>;

  @Effect()
  effect() {
    this.props.childRef.current = this.spanRef.current;
    debugger;
    if (this.props.childRef) {
      this.props.childRef.current!.innerHTML += "assignChildText";
    }
  }
}
