import {
    Component,
    OneWay,
    ComponentBindings,
    JSXComponent,
    Template,
  } from "@devextreme-generator/declarations";
  import DomCompoentWrapper from "./dom_component_wrapper";

  function view(model: Widget): JSX.Element {
    return (
      <DomCompoentWrapper>
      </DomCompoentWrapper>
    );
  }

  @ComponentBindings()
  export class WidgetInput {
    @OneWay() prop1 = 10;
    @OneWay() prop2 = "text";
    @Template() templateProp?: any;
  }

  @Component({
    view: view,
  })
  export default class Widget extends JSXComponent(WidgetInput) {
  }
