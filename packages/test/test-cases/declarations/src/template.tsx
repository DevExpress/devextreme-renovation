import {
  Component,
  Template,
  ComponentBindings,
  JSXComponent,
  OneWay,
  JSXTemplate,
} from "../../../../component_declaration/common";
import { WidgetWithProps, WidgetWithPropsInput } from "./dx-widget-with-props";

@ComponentBindings()
export class WidgetInput {
  @OneWay() someProp: boolean = false;
  @Template()
  headerTemplate: JSXTemplate = () => null;
  @Template() template: JSXTemplate<{
    textProp: string;
    textPropExpr: string;
  }> = () => <div></div>;
  @Template() contentTemplate: JSXTemplate<
    {
      data: { p1: string };
      index: number;
    },
    "data"
  > = (props) => <div>{props.data.p1}</div>;
  @Template() footerTemplate: JSXTemplate<{
    someProp: boolean;
  }> = () => <div></div>;
  @Template()
  componentTemplate: JSXTemplate<
    WidgetWithPropsInput,
    "value"
  > = WidgetWithProps;
}

@Component({
  view: view,
})
export default class WidgetWithTemplate extends JSXComponent(WidgetInput) {}

function view(viewModel: WidgetWithTemplate) {
  const myvar = viewModel.props.someProp;
  const FooterTemplate = viewModel.props.footerTemplate;
  const ComponentTemplate = viewModel.props.componentTemplate;
  return (
    <div>
      <viewModel.props.headerTemplate />
      {viewModel.props.contentTemplate && (
        <viewModel.props.contentTemplate data={{ p1: "value" }} index={10} />
      )}
      {!viewModel.props.contentTemplate && (
        <viewModel.props.template
          textProp="textPropValue"
          textPropExpr={"textPropExrpValue"}
        />
      )}
      {FooterTemplate && <FooterTemplate someProp={myvar}></FooterTemplate>}
      <ComponentTemplate value="Test Value" />
    </div>
  );
}
