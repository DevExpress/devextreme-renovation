import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  OneWay,
  Template,
} from "../../../component_declaration/common";
import SampleWidget from "./sample-widget";

export const viewFunction = (model: TemplateDefaultValue) => (
  <div>
    TemplateDefaultValue
    <model.props.contentTemplate />
    <model.props.contentTemplate text={model.props.stringToRender} />
    <model.props.contentTemplate textWithDefault={model.props.stringToRender} />
  </div>
);

@ComponentBindings()
export class TemplateDefaultValueProps {
  @Template() contentTemplate: JSXTemplate<{
    text?: string;
    textWithDefault?: string;
    number?: number;
  }> = SampleWidget;
  @OneWay() stringToRender: string = "default string";
}

@Component({
  view: viewFunction,
})
export default class TemplateDefaultValue extends JSXComponent(
  TemplateDefaultValueProps
) {}
