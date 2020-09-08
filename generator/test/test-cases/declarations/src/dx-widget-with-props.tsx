import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Method,
} from "../../../../component_declaration/common";

@ComponentBindings()
export class WidgetWithPropsInput {
  @OneWay() value = "default text";
  @OneWay() optionalValue?: string;
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
