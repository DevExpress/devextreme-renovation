import {
  Component,
  Event,
  TwoWay,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declarations";

function view(model: ModelWidget):JSX.Element|null {
  return <div>{model.props.baseStateProp}</div>;
}

@ComponentBindings()
class ModelWidgetInput {
  @TwoWay() baseStateProp?: boolean;
  @Event() baseStatePropChange?: (stateProp?: boolean) => void;

  @TwoWay({ isModel: true }) modelStateProp?: boolean;
  @TwoWay() value?: boolean;
}
@Component({
  view,
})
export default class ModelWidget extends JSXComponent(ModelWidgetInput) {}
