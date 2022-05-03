import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  Ref,
  RefObject,
} from "@devextreme-generator/declarations";
import RefProps from "./ref-props";

function view({ contentRef, onRefClick }: RefPass) {
  return (
    <div ref={contentRef} onClick={onRefClick}>
      <RefProps parentRef={contentRef} />
    </div>
  );
}

@ComponentBindings()
class Props { }

@Component({
  view,
  jQuery: { register: true },
})
export default class RefPass extends JSXComponent(Props) {
  @Ref() contentRef!: RefObject<HTMLDivElement>;

  onRefClick() {
    console.log(this.contentRef)
  }

  @Effect()
  loadEffect() {
    if (this.contentRef.current) {
      this.contentRef.current.innerHTML += "parentText";
    }
  }
}
