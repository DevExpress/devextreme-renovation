import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  OneWay,
} from "../../../../component_declaration/common";

import DynamicComponent, { WidgetInput } from "./props";

function view({
  Components,
  onComponentClick,
}: DynamicComponentCreator): JSX.Element {
  return (
    <div>
      {Components.map((C, index) => (
        <C key={index} onClick={onComponentClick} />
      ))}
    </div>
  );
}

@ComponentBindings()
class Props {
  @OneWay() height: number = 10;
}

@Component({
  view: view,
})
export default class DynamicComponentCreator extends JSXComponent(Props) {
  get Components(): JSXTemplate<WidgetInput>[] {
    return [DynamicComponent] as JSXTemplate<WidgetInput>[];
  }

  onComponentClick() {}
}
