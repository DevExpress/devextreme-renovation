import {
  Component,
  ComponentBindings,
  JSXComponent,
  Provider,
  Slot,
} from "../../../component_declaration/common";

import { Context } from "./context";
import { PluginContext } from "./context";

function view(model: GridComponent) {
  return <div>{model.props.children}</div>;
}

@ComponentBindings()
class Props {
  @Slot() children: any;
}

@Component({
  view,
})
export default class GridComponent extends JSXComponent(Props) {
  @Provider(Context)
  context: PluginContext = new PluginContext();
}
