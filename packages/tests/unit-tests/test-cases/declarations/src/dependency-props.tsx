import {
    Component,
    ComponentBindings,
    JSXComponent,
    OneWay,
    Event,
    TwoWay,
  } from "@devextreme-generator/declarations";
  
  function view(model: InnerWidget) {
    return <div style={{ width: 100, height: 100 }}></div>;
  }
  
  @ComponentBindings()
  export class InnerWidgetProps {
    @OneWay() visible = true;
    @OneWay() selected?: boolean;
    @TwoWay() value = 14;
    @OneWay() required!: boolean;
  }

  
  @Component({
    view: view,
  })
  export default class InnerWidget extends JSXComponent<InnerWidgetProps, 'required'>(InnerWidgetProps) {
      get someGetter(): string {
          return this.props.value.toString() + this.props.required.toString();
      }
  }