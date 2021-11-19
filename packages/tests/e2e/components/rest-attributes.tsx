import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "@devextreme-generator/declarations";

function view(model: ComponentWithRest) {
  return <div {...model.restAttributes}></div>;
}

@ComponentBindings()
class WidgetInput {
  @OneWay() containerId: string = "default";
}

@Component({
  view,
  jQuery: {register: true},
})
export default class ComponentWithRest extends JSXComponent(WidgetInput) {}
