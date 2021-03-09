import {
  Component,
  Template,
  ComponentBindings,
  JSXComponent,
  Ref,
  RefObject,
} from "@devextreme-generator/declaration";

@ComponentBindings()
export class WidgetInput {
  @Template() headerTemplate: any = () => null;
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  @Ref() headerRef?: RefObject;
}

function view(viewModel: Widget) {
  const HeaderTemplate = viewModel.props.headerTemplate;
  return (
    <div>
      <HeaderTemplate ref={viewModel.headerRef} />
    </div>
  );
}
