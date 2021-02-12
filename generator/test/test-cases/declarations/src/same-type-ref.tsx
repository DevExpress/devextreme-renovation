import {
  Component,
  Ref,
  JSXComponent,
  ComponentBindings,
  RefObject,
} from "../../../../component_declaration/common";
import BaseWidget from "./method";

function view(viewModel: Widget) {
  return <BaseWidget></BaseWidget>;
}

@ComponentBindings()
class WidgetInput {
  @Ref() nullableRef?: RefObject<HTMLDivElement>;
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  @Ref() divRef1!: RefObject<BaseWidget>;
  @Ref() divRef2!: RefObject<BaseWidget>;
}
