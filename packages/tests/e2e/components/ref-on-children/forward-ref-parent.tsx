import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  ForwardRef,
  RefObject,
} from "@devextreme-generator/declaration";
import Child from "./child";
import ChildWithAssign from "./child-with-assign";

function view({ firstChild, secondChild }: ForwardRefParent) {
  return (
    <span>
      <Child childRef={firstChild} />
      <ChildWithAssign childRef={secondChild} />
    </span>
  );
}

@ComponentBindings()
class Props {}

@Component({
  view,
})
export default class ForwardRefParent extends JSXComponent(Props) {
  @ForwardRef() firstChild!: RefObject<HTMLDivElement>;
  @ForwardRef() secondChild!: RefObject<HTMLDivElement>;

  @Effect()
  effect() {
    if (this.firstChild.current) {
      this.firstChild.current.style.backgroundColor = "rgb(120, 120, 120)";
    }
    if (this.secondChild.current) {
      this.secondChild.current.style.backgroundColor = "rgb(200, 200, 200)";
    }
  }
}
