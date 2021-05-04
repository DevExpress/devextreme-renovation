import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  Template,
  Fragment,
  ForwardRef,
  RefObject,
} from "@devextreme-generator/declarations";

function view(model: RefOnChildrenTemplate) :JSX.Element|null {
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
    if (this.child.current) {
      this.child.current.innerHTML += "ParentText";
    }
  }
}
