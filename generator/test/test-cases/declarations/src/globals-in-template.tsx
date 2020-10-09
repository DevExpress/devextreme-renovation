import {
  JSXComponent,
  Component,
  ComponentBindings,
} from "../../../../component_declaration/common";
import { COMPONENT_INPUT_CLASS } from "./component-input";
import { WidgetTwo as ExternalComponent } from "./component-pass-two";

export const PREFIX = "dx";
export const CLASS_NAME = PREFIX + "c1" + "c2" + COMPONENT_INPUT_CLASS;

function view() {
  return (
    <div className={CLASS_NAME}>
      <span className={CLASS_NAME}></span>
      <ExternalComponent />
    </div>
  );
}

@ComponentBindings()
export class WidgetProps {}

@Component({ view })
export default class WidgetWithGlobals extends JSXComponent(WidgetProps) {}
