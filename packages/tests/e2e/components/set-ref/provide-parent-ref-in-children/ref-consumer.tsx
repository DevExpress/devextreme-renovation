import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  ForwardRef,
  RefObject,
} from "@devextreme-generator/declarations";

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
    const temp = elementRef?.current;
    return temp;
  }

  @Effect({ run: "once" })
  init() {
    const elementRef = this.getElementRef();
    if (elementRef) {
      elementRef.innerHTML += ":element passed";
    }
  }
}
