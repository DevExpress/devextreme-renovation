import {
    Component,
    ComponentBindings,
    JSXComponent,
  } from "@devextreme-generator/declarations";

  import { WidgetWithProps } from './dx-widget-with-props';
  
  function view({ onClick }: Widget) {
    return <WidgetWithProps 
      onClick={onClick}>
    </WidgetWithProps>;
  }
  
  @ComponentBindings()
  class WidgetInput {
  }
  
  @Component({
    view,
  })
  export default class Widget extends JSXComponent(WidgetInput) {
    onClick() {
    }
  }
  