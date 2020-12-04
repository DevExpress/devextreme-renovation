import {
  Component,
  ComponentBindings,
  JSXComponent,
  Ref,
  Effect,
  RefObject,
} from "../../component_declaration/common";

function view(model: RefProps) {
  return <div>{"Ref Props"}</div>;
}

@ComponentBindings()
class Props {
  @Ref() parentRef!: RefObject<HTMLDivElement>;
}

@Component({
  view,
})
export default class RefProps extends JSXComponent<Props, "parentRef">() {
  @Effect()
  loadEffect() {
    const { parentRef } = this.props;
    parentRef.style.backgroundColor = "#aaaaff";
    parentRef.innerHTML += "childText";
  }
}
