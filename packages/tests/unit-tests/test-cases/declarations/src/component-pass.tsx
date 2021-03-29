import {
  Component,
  ComponentBindings,
  Fragment,
  JSXComponent,
  OneWay,
} from "@devextreme-generator/declarations";
import WidgetOne from "./component-pass-one";
import { WidgetTwo } from "./component-pass-two";

function view(model: Widget) {
  const ComponentFromVar = WidgetOne;
  const ComponentByCondition = model.props.mode ? ComponentFromVar : WidgetTwo;
  const SelfClosingComponentByCondition = model.props.mode
    ? ComponentFromVar
    : WidgetTwo;
  const SelfClosingComponentFromVar = WidgetTwo;
  const SelfClosingComponentByConditionFromVar = SelfClosingComponentByCondition;
  return (
    <Fragment>
      <ComponentByCondition text={model.props.firstText}>
        <div>Slot content</div>
      </ComponentByCondition>
      <ComponentFromVar text={model.props.secondText}>
        <div>Children go here</div>
      </ComponentFromVar>
      <SelfClosingComponentByCondition text="self closing by condition" />
      <SelfClosingComponentFromVar text="self closing" />
      <SelfClosingComponentByConditionFromVar text={model.props.secondText} />
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
