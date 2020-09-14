import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  ForwardRef,
} from "../../../component_declaration/common";
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
  @ForwardRef() firstChild!: HTMLDivElement;
  @ForwardRef() secondChild!: HTMLDivElement;

  @Effect()
  effect() {
    this.firstChild.style.backgroundColor = "rgb(120, 120, 120)";
    this.secondChild.style.backgroundColor = "rgb(200, 200, 200)";
  }
}
