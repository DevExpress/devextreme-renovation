import {
  Component,
  Template,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declarations";
import WidgetWithTemplate from "./dx-widget-with-template";

@ComponentBindings()
export class TemplateTransitWidgetInput {
  @Template() templateProp?: any;
  @Template() componentTemplateProp?: any;
}

@Component({
  view: view_1,
})
export default class TemplateTransitWidget extends JSXComponent(
  TemplateTransitWidgetInput
) {}

function view_1({
  props: { templateProp, componentTemplateProp: ComponentTemplateProp },
}: TemplateTransitWidget) {
  return (
    <WidgetWithTemplate
      template={templateProp}
      componentTemplate={ComponentTemplateProp}
    />
  );
}
function view_2(viewModel: TemplateTransitWidget) {
  const { templateProp: TemplateProp } = viewModel.props;
  const ComponentTemplateProp = viewModel.props.componentTemplateProp;
  return (
    <WidgetWithTemplate
      template={TemplateProp}
      componentTemplate={ComponentTemplateProp}
    />
  );
}
function view_3(viewModel: TemplateTransitWidget) {
  return (
    <WidgetWithTemplate
      template={viewModel.props.templateProp}
      componentTemplate={viewModel.props.componentTemplateProp}
    />
  );
}
