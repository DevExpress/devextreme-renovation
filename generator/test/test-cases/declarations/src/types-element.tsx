import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "../../../../component_declaration/common";

export const viewFunction = (viewModel: Widget) => {
  return <div></div>;
};

@ComponentBindings()
export class WidgetProps {
  @OneWay() element?: Element;
  @OneWay() htmlElement?: HTMLElement;
  @OneWay() divElement?: HTMLDivElement;
  @OneWay() svgElement?: SVGElement;
}

@Component({ view: viewFunction })
export default class Widget extends JSXComponent(WidgetProps) {}
