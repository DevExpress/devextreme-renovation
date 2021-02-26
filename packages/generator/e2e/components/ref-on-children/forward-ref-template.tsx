import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  Template,
  ForwardRef,
  RefObject,
} from "../../../component_declaration/common";

function view({
  props: { contentTemplate: Template },
  child,
}: ForwardRefTemplate) {
  return <Template childRef={child} />;
}

@ComponentBindings()
class Props {
  @Template() contentTemplate: any;
}

@Component({
  view,
})
export default class ForwardRefTemplate extends JSXComponent(Props) {
  @ForwardRef() child!: RefObject<HTMLDivElement>;

  @Effect()
  effect() {
    if (this.child.current) {
      this.child.current.style.backgroundColor = "rgb(120, 120, 120)";
    }
  }
}
