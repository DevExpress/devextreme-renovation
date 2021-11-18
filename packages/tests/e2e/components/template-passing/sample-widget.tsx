import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "@devextreme-generator/declarations";

function view(model: SampleWidget) {
  return (
    <div>
      <span>Component Default:</span>
      <span>{model.props.textWithDefault}</span>
      <span>|</span>
      <span>{model.props.text}</span>
    </div>
  );
}

@ComponentBindings()
class SampleWidgetProps {
  @OneWay() text?: string;
  @OneWay() textWithDefault = "sample widget";
}

@Component({
  view,
  jQuery: {register: true},
})
export default class SampleWidget extends JSXComponent(SampleWidgetProps) {}
