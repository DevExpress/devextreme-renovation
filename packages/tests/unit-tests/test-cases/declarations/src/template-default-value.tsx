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
    <model.props.defaultCompTemplate
      optionalValue={model.props.stringToRender}
      value={"twdComp"}
    />
    <model.props.defaultCompTemplate value={model.props.stringToRender} />
    <model.props.defaultFuncTemplate value={model.props.stringToRender} />
  </div>
);

@ComponentBindings()
export class TemplateDefaultValueProps {
  @Template() defaultCompTemplate: JSXTemplate<
    {
      optionalValue?: string | undefined;
      value: string;
    },
    "value"
  > = WidgetWithProps;
  @Template() defaultFuncTemplate: JSXTemplate<
    {
      optionalValue?: string | undefined;
      value: string;
    },
    "value"
  > = (props) => (
    <div>
      !DefaultFunc:{props.value || "ftwdCompDefault"}
      {props.optionalValue}
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
