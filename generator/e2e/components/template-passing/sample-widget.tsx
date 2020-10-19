import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "../../../component_declaration/common";

function view(model: SampleWidget) {
  return (
    <div>
      !Sample Def:{model.props.textWithDefault}|{model.props.text}!
    </div>
  );
}

@ComponentBindings()
class SampleWidgetProps {
  @OneWay() text?: string;
  @OneWay() textWithDefault = "swtext";
}

@Component({
  view,
})
export default class SampleWidget extends JSXComponent(SampleWidgetProps) {}
