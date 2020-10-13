import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  OneWay,
  Template,
} from "../../../../component_declaration/common";
import { WidgetWithProps } from "./dx-widget-with-props";

export const viewFunction = (model: TemplateDefaultValue) => (
  <div>
    TemplateDefaultValue
    <model.props.contentTemplate
      data={{ p1: model.props.stringToRender }}
      index={5}
    />
    ComponentTemplateDefaultValue
    <model.props.compTemplate value={model.props.stringToRender} />
    <model.props.compTemplate value={"I am 5 string"} index={5} />
  </div>
);

@ComponentBindings()
export class TemplateDefaultValueProps {
  @Template() contentTemplate: (props: {
    data: { p1: string };
    index: number;
  }) => JSX.Element = (props) => <span>{props.data.p1}</span>;
  @OneWay() stringToRender: string = "default string";
  @Template() compTemplate: JSXTemplate<
    {
      value?: string;
      index?: number;
    },
    "value"
  > = WidgetWithProps;
}

@Component({
  view: viewFunction,
})
export default class TemplateDefaultValue extends JSXComponent(
  TemplateDefaultValueProps
) {}
