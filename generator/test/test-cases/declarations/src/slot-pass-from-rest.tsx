import {
  Component,
  ComponentBindings,
  Slot,
  JSXComponent,
} from "../../../../component_declaration/common";
import Widget from "./slots";

function view({ props: { ...rest } }: SlotPass) {
  return (
    <div>
      <Widget {...rest} />
    </div>
  );
}

@ComponentBindings()
class WidgetInput {
  @Slot() children?: JSX.Element;
}
@Component({
  view: view,
})
export default class SlotPass extends JSXComponent(WidgetInput) {}
