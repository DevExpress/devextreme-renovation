import {
  Component,
  ComponentBindings,
  JSXComponent,
  Ref,
  Effect,
  RefObject,
} from "@devextreme-generator/declarations";

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
    if (parentRef.current) {
      parentRef.current.style.backgroundColor = "#aaaaff";
      parentRef.current.innerHTML += "childText";
    }
  }
}
