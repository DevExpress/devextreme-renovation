import {
  Component,
  ComponentBindings,
  JSXComponent,
  ForwardRef,
  Effect,
  RefObject,
} from "@devextreme-generator/declarations";

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
    if (this.props.childRef.current) {
      this.props.childRef.current.innerHTML += "childText";
    }
  }
}
