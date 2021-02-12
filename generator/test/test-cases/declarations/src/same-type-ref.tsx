import {
  Component,
  Ref,
  JSXComponent,
  ComponentBindings,
  RefObject,
} from "../../../../component_declaration/common";

import { Widget as WidgetR } from "./export-named-api-ref";

function view(viewModel: Widget) {
  return <div></div>;
}

@ComponentBindings()
class WidgetInput {
  @Ref() nullableRef?: RefObject<HTMLDivElement>;
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  @Ref() divRef1!: RefObject<WidgetR>;
  @Ref() divRef2!: RefObject<WidgetR>;
}
