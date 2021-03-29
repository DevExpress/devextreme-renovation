import {
  Component,
  ComponentBindings,
  JSXComponent,
  Provider,
  Slot,
} from "@devextreme-generator/declarations";

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
  contextProvider: PluginContext = new PluginContext();
}
