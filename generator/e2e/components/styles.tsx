import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "../../component_declaration/common";

function view(model: StylesWidget) {
  return (
    <div id={model.props.id}>
      <div style={model.styles}>There is component with styles getter</div>
      <div
        style={{
          backgroundColor: "green",
          zIndex: 100,
          width: "100",
          height: 100,
          opacity: 0.5,
        }}
      >
        There is component with inline styles
      </div>
    </div>
  );
}

@ComponentBindings()
class StylesWidgetProps {
  @OneWay() id?: string;
}

@Component({
  view,
})
export default class StylesWidget extends JSXComponent(StylesWidgetProps) {
  get styles() {
    return {
      backgroundColor: "red",
      zIndex: 100,
      width: "100",
      height: 100,
    };
  }
}
