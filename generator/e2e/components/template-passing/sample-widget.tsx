import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "../../../component_declaration/common";

function view(model: SampleWidget) {
  return (
    <div>
      !Sample Def:{model.props.textWithDefault}
      Number:{model.props.number}
      Text:{model.props.text}!
    </div>
  );
}

@ComponentBindings()
class SampleWidgetProps {
  @OneWay() text?: string;
  @OneWay() textWithDefault = "swtext";
  @OneWay() number = 42;
}

@Component({
  view,
})
export default class SampleWidget extends JSXComponent(SampleWidgetProps) {}
