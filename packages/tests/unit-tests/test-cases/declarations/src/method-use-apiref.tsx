import {
  Component,
  ComponentBindings,
  OneWay,
  Ref,
  Method,
  JSXComponent,
  RefObject,
} from "@devextreme-generator/declarations";
import BaseWidget from "./method";

function view(viewModel: WidgetWithApiRef):JSX.Element|null {
  return (
    <BaseWidget
      ref={viewModel.baseRef}
      prop1={viewModel.props.prop1}
    ></BaseWidget>
  );
}

@ComponentBindings()
class WidgetWithApiRefInput {
  @OneWay() prop1?: number;
}

@Component({
  view: view,
})
export default class WidgetWithApiRef extends JSXComponent(
  WidgetWithApiRefInput
) {
  @Ref()
  baseRef?: RefObject<BaseWidget>;

  @Method()
  getSomething(): string {
    return `${this.props.prop1} + ${this.baseRef?.current?.getHeight(
      1,
      undefined
    )}`;
  }
}
