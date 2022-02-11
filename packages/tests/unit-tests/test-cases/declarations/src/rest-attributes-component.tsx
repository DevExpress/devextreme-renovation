import {
    Component,
    ComponentBindings,
    JSXComponent,
    Ref,
    RefObject,
  } from "@devextreme-generator/declarations";

  import { WidgetWithProps } from './dx-widget-with-props';
  
  function view({ restAttributes}: ComponentWithRest) {
    return <WidgetWithProps 
      {...restAttributes}>
    </WidgetWithProps>;
  }
  
  @ComponentBindings()
  class WidgetInput {
  }
  
  @Component({
    view,
  })
  export default class ComponentWithRest extends JSXComponent(WidgetInput) {
  }
  