import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  ForwardRef,
  RefObject,
} from "../../../../component_declaration/common";

function view(model: RefConsumer) {
  return <span>consumer is rendered</span>;
}

@ComponentBindings()
class Props {
  @ForwardRef() elementRef?: RefObject<HTMLDivElement>;
}

@Component({
  view,
})
export default class RefConsumer extends JSXComponent<Props>() {
  getElementRef() {
    const { elementRef } = this.props;
    const temp = elementRef;
    return temp;
  }

  @Effect({ run: "once" })
  init() {
    const elementRef = this.getElementRef();
    if (elementRef?.current) {
      elementRef.current.innerHTML += ":element passed";
    }
  }
}
