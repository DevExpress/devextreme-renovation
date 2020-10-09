import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "../../../../component_declaration/common";

export const viewFunction = ({ props: { a, ...rest } }: Widget) => {
  return <div {...rest}></div>;
};

@ComponentBindings()
export class WidgetProps {
  @OneWay() a: Array<Number> = [1, 2, 3];
  @OneWay() id: string = "1";
}

@Component({ view: viewFunction })
export default class Widget extends JSXComponent(WidgetProps) {}
