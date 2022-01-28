import {
  Component,
  ComponentBindings,
  CSSAttributes,
  JSXComponent,
  OneWay,
  Slot,
} from "@devextreme-generator/declarations";

function view({ props: { style } }: WidgetWithStyleProp) {
  return (
    <div style={style}></div>
  );
}

@ComponentBindings()
export class WidgetWithStylePropProps {
  @OneWay() style?: CSSAttributes;
}

@Component({
  view: view,
})
export default class WidgetWithStyleProp extends JSXComponent(WidgetWithStylePropProps) {}
