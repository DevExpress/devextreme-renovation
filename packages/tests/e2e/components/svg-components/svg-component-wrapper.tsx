import {
  Component,
  ComponentBindings,
  JSXComponent,
  Slot,
} from "@devextreme-generator/declarations";

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
  jQuery: {register: true},
})
export default class SvgComponentWrapper extends JSXComponent<
  Props,
  "children"
>() {}
