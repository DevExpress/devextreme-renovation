import { Component, ComponentBindings, JSXComponent, Ref, OneWay } from "../../../component_declaration/common";

function view(model: RefProps) { 
    return <div>{"Ref Props"}</div>;
}

@ComponentBindings()
class Props {
    @Ref() parentRef: HTMLDivElement = {};
}

@Component({
    view
})
export default class RefProps extends JSXComponent<Props> {
  @Effect()
  loadEffect() {
      const ref = this.props.parentRef;

      if(ref) {
          ref.style.backgroundColor = "#aaaaff";
      }
  }
}
