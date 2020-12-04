import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  ForwardRef,
  RefObject,
} from "../../../../component_declaration/common";

import SetForwardRef from "./middle";

function view({ host }: SetForwardRefDeepParent) {
  return <SetForwardRef host={host} />;
}

@ComponentBindings()
class Props {}

@Component({
  view,
})
export default class SetForwardRefDeepParent extends JSXComponent<Props>() {
  @ForwardRef() host!: RefObject<HTMLDivElement>;

  @Effect()
  setContent() {
    this.host.innerHTML = "content in forwardRefDeep";
  }
}
