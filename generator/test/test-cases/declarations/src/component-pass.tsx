import {
  Component,
  ComponentBindings,
  Fragment,
  JSXComponent,
  OneWay,
} from "../../../../component_declaration/common";
import WidgetOne from "./component-pass-one";
import WidgetTwo from "./component-pass-two";

function view(model: Widget) {
  const ComponentByCondition = model.props.mode ? WidgetOne : WidgetTwo;
  const ComponentFromVar = WidgetOne;
  return (
    <Fragment>
      <ComponentByCondition text={model.props.firstText}>
        <div>Slot content</div>
      </ComponentByCondition>
      <ComponentFromVar text={model.props.secondText}>
        <div>Children go here</div>
      </ComponentFromVar>
    </Fragment>
  );
}

@ComponentBindings()
export class WidgetProps {
  @OneWay() mode?: boolean = false;
  @OneWay() firstText?: string;
  @OneWay() secondText?: string;
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetProps) {}
