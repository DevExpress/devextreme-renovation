import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  ForwardRef,
  RefObject,
} from "@devextreme-generator/declarations";
import Child from "./child";

function view({ props: { childRef } }: ForwardRefDeep) {
  return <Child childRef={childRef} />;
}

@ComponentBindings()
class Props {
  @ForwardRef() childRef!: RefObject<HTMLDivElement>;
}

@Component({
  view,
})
export default class ForwardRefDeep extends JSXComponent<Props, "childRef">() {
  @Effect()
  effect() {
    if (this.props.childRef.current) {
      this.props.childRef.current.style.border = "1px solid rgb(0, 0, 128)";
    }
  }
}
