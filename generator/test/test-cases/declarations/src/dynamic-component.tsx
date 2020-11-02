import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  OneWay,
  Template,
  InternalState,
} from "../../../../component_declaration/common";

import DynamicComponent, { WidgetInput } from "./props";

function view({
  Component,
  JSXTemplateComponent,
  internalStateValue,
  props: { height },
  onComponentClick,
}: DynamicComponentCreator): JSX.Element {
  return (
    <div>
      <JSXTemplateComponent
        height={internalStateValue}
        onClick={onComponentClick}
      />
      <Component height={height} onClick={onComponentClick} />
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
  @InternalState() internalStateValue = 0;

  get Component(): typeof DynamicComponent {
    return DynamicComponent;
  }

  get JSXTemplateComponent(): JSXTemplate<WidgetInput> {
    return DynamicComponent as JSXTemplate<WidgetInput>;
  }

  onComponentClick() {}
}
