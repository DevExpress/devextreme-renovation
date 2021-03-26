import {
  Component,
  ComponentBindings,
  Slot,
  JSXComponent,
  OneWay,
} from "@devextreme-generator/declarations";
import Widget from "./slots";

function view({ props: { p, ...rest } }: SlotPass) {
  return (
    <div>
      <Widget {...rest} />
    </div>
  );
}

@ComponentBindings()
class WidgetInput {
  @OneWay() p = "";
  @Slot() children?: JSX.Element;
}
@Component({
  view: view,
})
export default class SlotPass extends JSXComponent(WidgetInput) {}
