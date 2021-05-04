import {
  Component,
  OneWay,
  Event,
  ComponentBindings,
  JSXComponent,
  TwoWay,
  CSSAttributes,
} from "@devextreme-generator/declarations";

const modifyStyles = (styles: CSSAttributes) => {
  return {
    height: "100px",
    ...styles,
  };
};

function view({ styles }: Widget):JSX.Element|null {
  return <span style={styles}></span>;
}

@ComponentBindings()
class WidgetInput {}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  get styles() {
    const { style } = this.restAttributes;
    return modifyStyles(style);
  }
}
