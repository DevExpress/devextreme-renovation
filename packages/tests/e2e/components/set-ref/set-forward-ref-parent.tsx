import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  ForwardRef,
  RefObject,
} from "@devextreme-generator/declaration";

import SetForwardRef from "./set-forward-child";

function view({ host }: SetForwardRef) {
  return <SetForwardRef forwardHost={host} />;
}

@ComponentBindings()
class Props {}

@Component({
  view,
})
export default class SetForwardRefParent extends JSXComponent<Props>() {
  @ForwardRef() host!: RefObject<HTMLDivElement>;

  @Effect()
  setContent() {
    if (this.host.current) {
      this.host.current.innerHTML = "content in forwardRef";
    }
  }
}
