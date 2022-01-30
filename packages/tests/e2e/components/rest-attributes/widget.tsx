import {
    Component,
    ComponentBindings,
    JSXComponent,
    Slot,
    OneWay,
  } from "@devextreme-generator/declarations";
  
  function view(model: RestAttributesWidget) {
    return (
      <div
        id="restAttributesWidget"
        className={model.props.className}
        {...model.restAttributes}
      >
        {model.props.children}
      </div>
    );
  }
  
  @ComponentBindings()
  export class RestAttributesWidgetInput {
    @Slot() children?: any;
    @OneWay() className?: string;
  }
  
  @Component({
    view,
  })
  export default class RestAttributesWidget extends JSXComponent(RestAttributesWidgetInput) {
  }
  