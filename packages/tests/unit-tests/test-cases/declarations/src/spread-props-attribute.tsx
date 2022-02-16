import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  TwoWay,
  InternalState,
  Fragment,
} from "@devextreme-generator/declarations";
import InnerWidget from "./dx-inner-widget";

function view({ attributes, props, restAttributes }: Widget) {
  return <Fragment>
    <InnerWidget {...(props as any)} {...restAttributes} />
    <div { ...attributes as any} />
  </Fragment>
}

@ComponentBindings()
export class WidgetInput {
  @OneWay() visible?: boolean;
  @TwoWay() value?: boolean;
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  @InternalState() counter = 1;
  @InternalState() notUsedValue = 1;
  get attributes () {
    return {
      visible: this.props.visible,
      value: this.counter
    }
  }
}
