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
      value={model.props.stringToRender}
      number={21}
    />
    <model.props.contentTemplate value={""} />
    <model.props.contentTemplate
      value={""}
      optionalValue={"optional" + model.props.stringToRender}
    />
  </div>
);

@ComponentBindings()
export class TemplateDefaultValueProps {
  @Template() contentTemplate: JSXTemplate<
    {
      value: string;
      optionalValue?: string;
      number: number;
    },
    "value"
  > = WidgetWithProps;
  @OneWay() stringToRender: string = "default string";
}

@Component({
  view: viewFunction,
})
export default class TemplateDefaultValue extends JSXComponent(
  TemplateDefaultValueProps
) {}
