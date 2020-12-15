import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  Template,
  Fragment,
  ForwardRef,
  RefObject,
} from "../../../../component_declaration/common";

function view(model: RefOnChildrenTemplate) {
  return (
    <Fragment>
      <model.props.contentTemplate
        childRef={model.child}
      ></model.props.contentTemplate>
    </Fragment>
  );
}

@ComponentBindings()
class Props {
  @Template() contentTemplate: any;
}

@Component({
  view,
})
export default class RefOnChildrenTemplate extends JSXComponent(Props) {
  @ForwardRef() child!: RefObject<HTMLDivElement>;

  @Effect()
  effect() {
    this.child.innerHTML += "ParentText";
  }
}
