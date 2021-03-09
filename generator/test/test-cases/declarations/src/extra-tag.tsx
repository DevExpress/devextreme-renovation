import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "devextreme-generator/component_declaration/common";
import SvgGraphicsProps from "./base_graphics_props";

export const viewFunction = ({
  computedProps,
}: TextSvgElement): JSX.Element => {
  const texts = [];
  const { text } = computedProps;
  return <text>{!texts.length && text}</text>;
};

@ComponentBindings()
export class TextSvgElementProps extends SvgGraphicsProps {
  @OneWay() text?: string | null = "";
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  isSVG: true,
})
export class TextSvgElement extends JSXComponent(TextSvgElementProps) {
  get computedProps(): TextSvgElementProps {
    return this.props;
  }
}
