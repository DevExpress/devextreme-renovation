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
    <model.props.compTemplate
      text={model.props.stringToRender}
      textWithDefault={"component text"}
    />
    <model.props.compTemplate text={model.props.stringToRender} />
    <model.props.funcTemplate text={model.props.stringToRender} />
  </div>
);

@ComponentBindings()
export class TemplateDefaultValueProps {
  @Template() compTemplate: JSXTemplate<{
    text?: string;
    textWithDefault?: string;
  }> = SampleWidget;
  @Template() funcTemplate: JSXTemplate<{
    text?: string;
    textWithDefault?: string;
  }> = (props: { text?: string; textWithDefault?: string }) => (
    <div>
      <span>Function Default:</span>
      <span>{props.textWithDefault || "functional default text"}</span>
      <span>|</span>
      <span>{props.text}</span>
    </div>
  );
  @OneWay() stringToRender: string = "stringPropDefault";
}

@Component({
  view: viewFunction,
})
export default class TemplateDefaultValue extends JSXComponent(
  TemplateDefaultValueProps
) {}
