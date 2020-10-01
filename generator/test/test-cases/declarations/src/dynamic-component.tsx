import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "../../../../component_declaration/common";

import DynamicComponent from "./props";

function view({
  Component,
  props: { height },
}: DynamicComponentCreator): JSX.Element {
  return <Component height={height} />;
}

@ComponentBindings()
class WidgetInput {
  @OneWay() height: number = 10;
}

@Component({
  view: view,
})
export default class DynamicComponentCreator extends JSXComponent(WidgetInput) {
  get Component() {
    return DynamicComponent;
  }
}
