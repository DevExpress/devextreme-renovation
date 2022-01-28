import {
  Component,
  ComponentBindings,
  JSXComponent,
  CSSAttributes,
  Fragment,
} from "@devextreme-generator/declarations";

import WidgetWithoutStyleProp from './component-pass-one';
import WidgetWithStyleProp from './widget-with-atyle-prop';

const modifyStyles = (styles: CSSAttributes) => {
  return {
    height: "100px",
    ...styles,
  };
};

function view({ styles }: Widget) {
  return <Fragment>
    <span style={styles}></span>
    <WidgetWithoutStyleProp style={styles}></WidgetWithoutStyleProp>
    <WidgetWithStyleProp style={styles}></WidgetWithStyleProp>
  </Fragment>;
}

@ComponentBindings()
class WidgetInput {
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  get styles() {
    const { style } = this.restAttributes;
    return modifyStyles(style);
  }
}
