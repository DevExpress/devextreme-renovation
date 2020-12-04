import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  Ref,
  RefObject,
} from "../../component_declaration/common";
import RefProps from "./ref-props";

function view({ contentRef }: RefPass) {
  return (
    <div ref={contentRef}>
      <RefProps parentRef={contentRef} />
    </div>
  );
}

@ComponentBindings()
class Props {}

@Component({
  view,
})
export default class RefPass extends JSXComponent(Props) {
  @Ref() contentRef!: RefObject<HTMLDivElement>;

  @Effect()
  loadEffect() {
    this.contentRef.innerHTML += "parentText";
  }
}
