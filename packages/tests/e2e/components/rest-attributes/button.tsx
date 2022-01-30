import {
    Component,
    ComponentBindings,
    JSXComponent,
    OneWay,
  } from "@devextreme-generator/declarations";

  import RestAttributesWidget from './widget';
  
  function view(model: RestAttributesButton) {
    return (
      <RestAttributesWidget
        className={model.props.className}
        {...model.restAttributes}
      >
        Default Text
      </RestAttributesWidget>
    );
  }
  
  @ComponentBindings()
  export class RestAttributesButtonInput {
    @OneWay() className?: string;
  }
  
  @Component({
    view,
    jQuery: {
        register: true
    }
  })
  export default class RestAttributesButton extends JSXComponent(RestAttributesButtonInput) {
  }
  