import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  Ref,
  RefObject,
} from "@devextreme-generator/declarations";
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
    if (this.contentRef.current) {
      this.contentRef.current.innerHTML += "parentText";
    }
  }
}
