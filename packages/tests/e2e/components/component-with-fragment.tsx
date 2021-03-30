import {
  Component,
  ComponentBindings,
  JSXComponent,
  Fragment,
} from "@devextreme-generator/declarations";

function view(model: ComponentWithFragment) {
  return (
    <Fragment>
      <div style={model.r} />
      <div style={model.g} />
      <div style={model.b} />
    </Fragment>
  );
}

@ComponentBindings()
class Props {}

const baseStyle = { width: 10, height: 10, display: "inline-block" };

@Component({ view })
export default class ComponentWithFragment extends JSXComponent(Props) {
  get r() {
    return {
      ...baseStyle,
      backgroundColor: "red",
    };
  }

  get g() {
    return {
      ...baseStyle,
      backgroundColor: "green",
    };
  }

  get b() {
    return {
      ...baseStyle,
      backgroundColor: "blue",
    };
  }
}
