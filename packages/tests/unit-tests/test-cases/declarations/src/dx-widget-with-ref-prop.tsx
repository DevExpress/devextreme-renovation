import {
  Component,
  Ref,
  ComponentBindings,
  JSXComponent,
  RefObject,
} from "@devextreme-generator/declarations";

@ComponentBindings()
export class WidgetWithRefPropInput {
  @Ref() parentRef?: RefObject;
  @Ref() nullableRef?: RefObject;
}

@Component({
  view: view,
})
export default class WidgetWithRefProp extends JSXComponent(
  WidgetWithRefPropInput
) {}

function view(viewModel: WidgetWithRefProp) {
  return <div></div>;
}
