import {
    Component,
    ComponentBindings,
    JSXComponent,
    OneWay,
  } from "@devextreme-generator/declarations";
  
  function view(model: ComponentWithRest) {
    return <div {...model.restAttributes}></div>;
  }
  
  @ComponentBindings()
  class WidgetInput {
    @OneWay() id?: string;
    @OneWay() export?: {};
  }
  
  @Component({
    view,
  })
  export default class ComponentWithRest extends JSXComponent(WidgetInput) {}
  