import {
    Component,
    ComponentBindings,
    JSXComponent,
    Fragment
  } from "@devextreme-generator/declarations";

  import { WidgetWithProps } from './dx-widget-with-props';
  
  function view({ onClickWithArgs, onClickWithoutArgs, onClickGetter }: Widget) {
    return <Fragment>
      <WidgetWithProps 
        onClick={onClickWithoutArgs}>
      </WidgetWithProps>
      <WidgetWithProps 
        onClick={onClickWithArgs}>
      </WidgetWithProps>
      <WidgetWithProps 
        onClick={onClickGetter}>
      </WidgetWithProps>
    </Fragment>;
  }
  
  @ComponentBindings()
  class WidgetInput {
  }
  
  @Component({
    view,
  })
  export default class Widget extends JSXComponent(WidgetInput) {
    onClickWithoutArgs() {
    }

    onClickWithArgs(args: unknown) {
    }

    get onClickGetter() {
      return () => {};
    }
  }
  