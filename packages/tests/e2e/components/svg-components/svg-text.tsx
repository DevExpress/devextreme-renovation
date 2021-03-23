import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "@devextreme-generator/declarations";

function view({ props: { text, x, y } }: SVGComponent) {
  return (
    <text x={x} y={y}>
      {text}
    </text>
  );
}

@ComponentBindings()
export class Props {
  @OneWay() text: string = "DefaultText";
  @OneWay() x = 0;
  @OneWay() y = 0;
}

@Component({
  view,
  isSVG: true,
})
export default class SVGComponent extends JSXComponent(Props) {}
