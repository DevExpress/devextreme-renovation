import {
    Component,
    ComponentBindings,
    JSXComponent,
    OneWay,
  } from "@devextreme-generator/declarations";

  import { WidgetWithProps } from './dx-widget-with-props';
  import { PublicWidgetWithProps } from './dx-public-widget-with-props';
  
  function view({ props: { isPublic }, restAttributes }: ComponentWithRest) {
    return isPublic ? ( <PublicWidgetWithProps 
      {...restAttributes}>
    </PublicWidgetWithProps>) :( <WidgetWithProps 
      {...restAttributes}>
    </WidgetWithProps>) ;
  }
  
  @ComponentBindings()
  class ComponentWithRestInput {
    @OneWay() isPublic = false;
  }
  
  @Component({
    view,
  })
  export default class ComponentWithRest extends JSXComponent(ComponentWithRestInput) {
  }
  