import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Template,
} from "../../../../component_declaration/common";

export const viewFunction = (model: TemplateDefaultValue) => (
  <div>
    TemplateDefaultValue
    <model.props.contentTemplate data={{ p1: model.props.stringToRender }} />
  </div>
);

@ComponentBindings()
export class TemplateDefaultValueProps {
  @Template() contentTemplate: (props: {
    data: { p1: string };
  }) => JSX.Element = (props) => <span>{props.data.p1}</span>;
  @OneWay() stringToRender: string = "default string";
}

@Component({
  view: viewFunction,
})
export default class TemplateDefaultValue extends JSXComponent(
  TemplateDefaultValueProps
) {}
