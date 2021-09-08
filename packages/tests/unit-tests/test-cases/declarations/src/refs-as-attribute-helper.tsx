import {
    Component,
    Ref,
    ComponentBindings,
    JSXComponent,
    OneWay,
  } from "@devextreme-generator/declarations";
@ComponentBindings()
class HelperWidgetProps {
  @OneWay() forwardRef?: HTMLDivElement | null;
  @OneWay() someRef?: HTMLDivElement | null;
  @OneWay() refProp?: HTMLDivElement | null;
  @OneWay() forwardRefProp?: HTMLDivElement | null;
}

function HelperView(model: HelperWidget) {
  return (
    <div>
      <div>Ref: {model.props?.someRef}</div>
      <div>ForwardRef: {model.props?.forwardRef}</div>
      <div>RefProp: {model.props?.refProp}</div>
      <div>ForwardRefProp: {model.props?.forwardRefProp}</div>
    </div>
  );
}

@Component({
  view: HelperView,
})
export default class HelperWidget extends JSXComponent(HelperWidgetProps) { 
}
