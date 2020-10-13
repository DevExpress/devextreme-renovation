import {
  Component,
  Template,
  ComponentBindings,
  JSXComponent,
  Ref,
} from "../../../../component_declaration/common";

@ComponentBindings()
export class WidgetInput {
  @Template() headerTemplate: any = () => null;
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  @Ref() headerRef?: any;
  @Ref() footerRef?: any;
}

function view(viewModel: Widget) {
  const HeaderTemplate = viewModel.props.headerTemplate;
  return (
    <div>
      <HeaderTemplate ref={viewModel.headerRef} />
    </div>
  );
}
