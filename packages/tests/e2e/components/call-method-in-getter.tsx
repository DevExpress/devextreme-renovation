import {
  Component,
  OneWay,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declarations";

function view(model: CallMethodInGetterWidget) {
  return <div id={model.props.id}>{model.text}</div>;
}

@ComponentBindings()
class WidgetProps {
  @OneWay() prop: number = 10;
  @OneWay() id: string = "id";
}

@Component({
  view,
})
export default class CallMethodInGetterWidget extends JSXComponent(
  WidgetProps
) {
  get text() {
    return this.getText();
  }

  private getText() {
    return (this.props.prop * 2).toString();
  }
}
