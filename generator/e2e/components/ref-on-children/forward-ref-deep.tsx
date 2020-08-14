import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  ForwardRef,
} from "../../../component_declaration/common";
import Child from "./child";

function view({ props: { childRef } }: ForwardRefDeep) {
  return <Child childRef={childRef} />;
}

@ComponentBindings()
class Props {
  @ForwardRef() childRef!: HTMLDivElement;
}

@Component({
  view,
})
export default class ForwardRefDeep extends JSXComponent<Props, "childRef">() {
  @Effect()
  effect() {
    this.props.childRef.style.border = "1px solid rgb(0, 0, 128)";
  }
}
