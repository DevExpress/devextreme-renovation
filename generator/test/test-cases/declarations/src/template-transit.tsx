import {
  Component,
  Template,
  ComponentBindings,
  JSXComponent,
} from "../../../../component_declaration/common";
import WidgetWithTemplate from "./dx-widget-with-template";

@ComponentBindings()
export class TemplateTransitWidgetInput {
  @Template() templateProp?: any;
  @Template() componentTemplateProp?: any;
}

@Component({
  view: view,
})
export default class TemplateTransitWidget extends JSXComponent(
  TemplateTransitWidgetInput
) {}

function view(viewModel: TemplateTransitWidget) {
  return (
    <WidgetWithTemplate
      template={viewModel.props.templateProp}
      componentTemplate={viewModel.props.componentTemplateProp}
    />
  );
}
