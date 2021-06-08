import {
  JSXComponent,
  Component,
  ComponentBindings,
  Nested,
  OneWay,
  TwoWay
} from "@devextreme-generator/declarations";

function view() {
  return <div></div>;
}

@ComponentBindings()
export class NestedProps {
  @OneWay() oneWay?: boolean = false;
  @TwoWay() twoWay?: boolean = false;
}

@ComponentBindings()
export class WidgetProps {
  @Nested() nested?: NestedProps;
}

@Component({
  view: view,
  defaultOptionRules: [
    {
      device: true,
      options: {
        nested: {
          oneWay: true
        }
      },
    },
  ],
})
export default class Widget extends JSXComponent(WidgetProps) {}
