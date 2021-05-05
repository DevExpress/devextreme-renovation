import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  OneWay,
  InternalState,
} from "@devextreme-generator/declarations";

import DynamicComponent, { WidgetInput } from "./props";
import DynamicComponentWithTemplate, {
  WidgetInput as PropsWithTemplate,
} from "./template";

function view({
  Component,
  JSXTemplateComponent,
  internalStateValue,
  ComponentWithTemplate,
  spreadProps,
  props: { height },
  onComponentClick,
}: DynamicComponentCreator): JSX.Element|null {
  return (
    <div>
      <JSXTemplateComponent
        height={internalStateValue}
        onClick={onComponentClick}
        {...spreadProps}
      />
      <Component height={height} onClick={onComponentClick} {...spreadProps} />
      <ComponentWithTemplate
        template={({ textProp }) => (
          <div style={{ height: "50px" }}>{textProp}</div>
        )}
      />
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

  get ComponentWithTemplate(): JSXTemplate<PropsWithTemplate> {
    return DynamicComponentWithTemplate as JSXTemplate<PropsWithTemplate>;
  }

  get spreadProps() {
    return { export: {} };
  }

  onComponentClick() {}
}
