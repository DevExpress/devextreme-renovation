import {
  Component,
  ComponentBindings,
  JSXComponent,
  InternalState,
  Slot,
  Fragment,
} from "../../../component_declaration/common";

import Button from "../button";

function view({
  condition,
  switchCondition,
  props: { children },
}: RenderSlotCondition) {
  const widget = <span id="render-slot-condition-content">{children}</span>;

  return (
    <Fragment>
      {condition ? (
        <Button id="render-slot-condition-in-button">{widget}</Button>
      ) : (
        widget
      )}
      <Button id="render-slot-condition-switch" onClick={switchCondition}>
        Switch Condition
      </Button>
    </Fragment>
  );
}

@ComponentBindings()
export class Props {
  @Slot() children?: any;
}

@Component({
  view,
})
export default class RenderSlotCondition extends JSXComponent(Props) {
  @InternalState() condition = false;

  switchCondition() {
    this.condition = !this.condition;
  }
}
