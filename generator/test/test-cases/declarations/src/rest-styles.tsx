import {
  Component,
  OneWay,
  Event,
  ComponentBindings,
  JSXComponent,
  TwoWay,
  CSSStyles,
} from "../../../../component_declaration/common";

const modifyStyles = (styles: CSSStyles) => {
  return {
    height: "100px",
    ...styles,
  };
};

function view({ styles }: Widget) {
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
