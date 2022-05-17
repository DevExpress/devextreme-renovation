import {
  Component,
  ComponentBindings,
  JSXComponent,
  Ref,
  Effect,
  RefObject,
  InternalState,
} from "@devextreme-generator/declarations";
import Button from "./button";

function view(model: RefProps) {
  return <div>
    {"Ref Props"}
    {/* {model.someState}
    <Button onClick={model.onButtClick}>Text</Button> */}
  </div>;
}

@ComponentBindings()
class Props {
  @Ref() parentRef!: RefObject<HTMLDivElement>;
}

@Component({
  view,
  jQuery: {register: true},
})
export default class RefProps extends JSXComponent<Props, "parentRef">() {
  // @InternalState() someState = 0;
  // onButtClick(){
  //   this.someState = this.someState + 1;
  // }
  @Effect()
  loadEffect() {
    setTimeout(() => {
      const {parentRef} = this.props;
    if (parentRef.current) {
      parentRef.current.style.backgroundColor = "#aaaaff";
      parentRef.current.innerHTML += "childText";
    }
    });
  }
}
