import {
  Component,
  Template,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
} from "@devextreme-generator/declarations";
import InnerWidget, { InnerWidgetProps } from './dependency-props';

@ComponentBindings()
export class WidgetWithTemplateInput {
  @Template() template?: any;
  @Template() componentTemplate: JSXTemplate<InnerWidgetProps, 'required'> = InnerWidget;
  @Template() arrowTemplate?: any;
}

@Component({
  view: view,
})
export default class WidgetWithTemplate extends JSXComponent(WidgetWithTemplateInput) {}

function view(viewModel: WidgetWithTemplate) {
  return (
    <div>
      <viewModel.props.componentTemplate required={true} />
      <viewModel.props.template />
      <viewModel.props.arrowTemplate />
    </div>
  );
}
