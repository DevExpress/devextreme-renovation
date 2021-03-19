import {
  Component,
  ComponentBindings,
  JSXComponent,
} from "../../component_declaration/common";

function view(_model: StylesWidget) {
  return (
    <div
      id={"styles-unification"}
      style={{
        backgroundColor: "green",
        zIndex: 100,
        width: "100",
        height: 100,
        opacity: 0.5,
        paddingLeft: "10",
      }}
    >
      There is component with styles
    </div>
  );
}

@ComponentBindings()
class StylesWidgetProps {}

@Component({
  view,
})
export default class StylesWidget extends JSXComponent(StylesWidgetProps) {}
