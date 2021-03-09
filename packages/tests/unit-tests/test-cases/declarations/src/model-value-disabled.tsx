import {
  Component,
  TwoWay,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "@devextreme-generator/declaration";

function view(model: ModelWidget) {
  return <div>{model.props.value}</div>;
}

@ComponentBindings()
class ModelWidgetInput {
  @OneWay() disabled?: boolean;
  @TwoWay() value?: boolean;
  @TwoWay() notValue?: boolean;
}
@Component({
  view,
})
export default class ModelWidget extends JSXComponent(ModelWidgetInput) {}
