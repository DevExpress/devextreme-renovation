import {
  Component,
  Template,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "../../../../component_declaration/common";

@ComponentBindings()
export class WidgetInput {
  @OneWay() someProp: boolean = false;
  @Template()
  headerTemplate?: any;
  @Template() template: (props: {
    textProp: string;
    textPropExpr: string;
  }) => JSX.Element = () => <div></div>;
  @Template() contentTemplate: (props: {
    data: { p1: string };
    index: number;
  }) => any = (props) => <div>{props.data.p1}</div>;
  @Template() footerTemplate: (props: { someProp: boolean }) => any = () => (
    <div></div>
  );
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {}

function view(viewModel: Widget) {
  const myvar = viewModel.props.someProp;
  const FooterTemplate = viewModel.props.footerTemplate;
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
    </div>
  );
}
