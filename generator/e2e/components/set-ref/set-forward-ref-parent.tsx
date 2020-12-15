import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  ForwardRef,
  RefObject,
} from "../../../component_declaration/common";

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
    this.host.innerHTML = "content in forwardRef";
  }
}
