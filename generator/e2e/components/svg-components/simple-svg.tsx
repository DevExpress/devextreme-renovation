import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  Ref,
  OneWay,
  InternalState,
} from "../../../component_declaration/common";

function view({
  host,
  clickCount,
  className,
  props: { fill, width, height },
}: SimpleSVGComponent) {
  return (
    <svg
      id="simple-svg-component"
      ref={host as any}
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width * 2} ${height * 2}`}
    >
      <rect
        width={width}
        height={height}
        fill={fill}
        stroke="green"
        strokeWidth={5}
      ></rect>
      <text id="simple-svg-component-text" x={width / 2} y={height / 2}>
        {clickCount}
      </text>
    </svg>
  );
}

@ComponentBindings()
export class Props {
  @OneWay() fill = "red";
  @OneWay() width = 100;
  @OneWay() height = 100;
}

@Component({
  view,
  isSVG: true,
})
export default class SimpleSVGComponent extends JSXComponent(Props) {
  @Ref() host!: SVGElement;

  @InternalState() clickCount = 0;

  @Effect() clickEffect() {
    const handler = (e: Event) => {
      this.clickCount = this.clickCount + 1;
    };
    this.host.addEventListener("click", handler);

    return () => this.host.removeEventListener("click", handler);
  }

  get className() {
    return "simple-svg-root";
  }
}
