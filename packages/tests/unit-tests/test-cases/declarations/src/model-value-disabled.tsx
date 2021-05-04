import {
  Component,
  TwoWay,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "@devextreme-generator/declarations";

function view(model: ModelWidget):JSX.Element|null {
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
