import {
  Component,
  ComponentBindings,
  JSXComponent,
  Fragment,
} from "../../../component_declaration/common";

import SimpleComponent from "./simple-svg";
import SvgRoot from "./svg-root";

function view(viewModel: SvgApp) {
  return (
    <div>
      <SimpleComponent width={30} height={30} />
      <SvgRoot width={100} height={30}>
        <Fragment>
          <text style={{ fill: "blue" }} x={10} y={12}>
            text
          </text>
        </Fragment>
      </SvgRoot>
    </div>
  );
}

@ComponentBindings()
export class Props {}

@Component({
  view,
})
export default class SvgApp extends JSXComponent(Props) {}
