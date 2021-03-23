import {
  Component,
  Template,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declarations";

@ComponentBindings()
export class WidgetWithTemplateInput {
  @Template() template?: any;
  @Template() componentTemplate?: any;
  @Template() arrowTemplate?: any;
}

@Component({
  view: view,
})
export default class WidgetWithTemplate extends JSXComponent(
  WidgetWithTemplateInput
) {}

function view(viewModel: WidgetWithTemplate) {
  return (
    <div>
      <viewModel.props.componentTemplate />
      <viewModel.props.template />
      <viewModel.props.arrowTemplate />
    </div>
  );
}
