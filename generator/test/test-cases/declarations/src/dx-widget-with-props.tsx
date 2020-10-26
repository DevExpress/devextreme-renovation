import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Method,
  Event,
} from "../../../../component_declaration/common";

@ComponentBindings()
export class WidgetWithPropsInput {
  @OneWay() value = "default text";
  @OneWay() optionalValue?: string;
  @OneWay() number? = 42;
  @Event() onClick?: (e: any) => void;
}

@Component({
  view: view,
})
export class WidgetWithProps extends JSXComponent(WidgetWithPropsInput) {
  @Method()
  doSomething() {}
}

function view({ props: { value, optionalValue } }: WidgetWithProps) {
  return <div>{optionalValue || value}</div>;
}
