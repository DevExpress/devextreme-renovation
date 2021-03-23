import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  ForwardRef,
  RefObject,
} from "@devextreme-generator/declarations";

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
    if (this.host.current) {
      this.host.current.innerHTML = "content in forwardRefDeep";
    }
  }
}
