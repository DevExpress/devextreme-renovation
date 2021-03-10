import {
  Component,
  OneWay,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declaration";

function view(model: ComponentWithSpread) {
  return (
    <div
      style={{
        width: 100,
        height: 10,
        backgroundColor: "blue",
      }}
      {...model.attributes}
    ></div>
  );
}

@ComponentBindings()
class WidgetInput {
  @OneWay() containerId: string = "default";
  @OneWay() aria: string = "default";
}

@Component({
  view,
})
export default class ComponentWithSpread extends JSXComponent(WidgetInput) {
  get attributes() {
    const { containerId: id, aria } = this.props;
    return {
      id,
      aria,
    };
  }
}
