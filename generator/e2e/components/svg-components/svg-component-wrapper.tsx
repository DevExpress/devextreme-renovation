import {
  Component,
  ComponentBindings,
  JSXComponent,
  Slot,
} from "../../../component_declaration/common";

import SvgRoot from "./svg-root";

function view({ props: { children } }: SvgComponentWrapper) {
  return (
    <div>
      <SvgRoot width={150} height={30}>
        {children}
      </SvgRoot>
    </div>
  );
}

@ComponentBindings()
export class Props {
  @Slot({
    isSVG: true,
  })
  children!: JSX.Element;
}

@Component({
  view,
})
export default class SvgComponentWrapper extends JSXComponent<
  Props,
  "children"
>() {}
