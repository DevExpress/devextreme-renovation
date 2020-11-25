import {
  Component,
  ComponentBindings,
  JSXComponent,
  Fragment,
} from "../../../component_declaration/common";

import SimpleComponent from "./simple-svg";
import SvgRoot from "./svg-root";
import SvgText from "./svg-text";

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

      <SvgRoot width={100} height={30}>
        <SvgText x={10} y={12} text={"MyText"} />
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
