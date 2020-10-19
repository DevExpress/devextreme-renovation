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
    <model.props.compTemplate
      text={model.props.stringToRender}
      textWithDefault={"twdComp"}
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
      !DefaultFunc:{props.textWithDefault || "ftwdCompDefault"} | {props.text}
    </div>
  );
  @OneWay() stringToRender: string = "strCompDefault";
}

@Component({
  view: viewFunction,
})
export default class TemplateDefaultValue extends JSXComponent(
  TemplateDefaultValueProps
) {}
