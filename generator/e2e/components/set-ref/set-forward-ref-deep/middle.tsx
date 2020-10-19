import {
  Component,
  ComponentBindings,
  JSXComponent,
  ForwardRef,
} from "../../../../component_declaration/common";

import SetForwardRefChild from "../set-forward-child";

function view({ props: { host } }: SetForwardRefDeepMiddle) {
  return <SetForwardRefChild forwardHost={host} />;
}

@ComponentBindings()
class Props {
  @ForwardRef() host!: HTMLDivElement;
}

@Component({
  view,
})
export default class SetForwardRefDeepMiddle extends JSXComponent<
  Props,
  "host"
>() {}
