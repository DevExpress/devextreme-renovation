import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Slot,
} from "@devextreme-generator/declarations";

function view({ props: { children, width, height } }: SvgRoot) {
  return (
    <svg width={width} height={height}>
      {children}
    </svg>
  );
}

@ComponentBindings()
export class Props {
  @OneWay() width = 100;
  @OneWay() height = 100;
  @Slot() children?: JSX.Element;
}

@Component({
  view,
  isSVG: true,
  jQuery: {register: true},
})
export default class SvgRoot extends JSXComponent(Props) {}
