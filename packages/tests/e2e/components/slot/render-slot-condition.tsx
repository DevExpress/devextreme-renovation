import {
  Component,
  ComponentBindings,
  JSXComponent,
  InternalState,
  Slot,
  Fragment,
} from "@devextreme-generator/declaration";

import Button from "../button";

function view({
  condition,
  switchCondition,
  props: { children },
}: RenderSlotCondition) {
  return (
    <Fragment>
      {condition ? (
        <Button id="render-slot-condition-in-button">
          <span id="render-slot-condition-content">{children}</span>
        </Button>
      ) : (
        <span id="render-slot-condition-content">{children}</span>
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
