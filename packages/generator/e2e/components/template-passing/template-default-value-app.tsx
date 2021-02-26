import {
  Component,
  ComponentBindings,
  JSXComponent,
} from "../../../component_declaration/common";
import TemplateDefaultValue from "./template-default-value";

const CustomTemplate = (props: { text?: string; textWithDefault?: string }) => {
  return (
    <div>
      <span>Component Custom:</span>
      <span>{props.text || ""}</span>
      <span>|</span>
      <span>{props.textWithDefault || ""}</span>
    </div>
  );
};
export const viewFunction = (model: TemplateDefaultValueApp) => (
  <div id="template-default-value-app">
    <b>TemplateDefaultValue</b>
    <hr />
    <TemplateDefaultValue
      funcTemplate={(props: {
        text?: string | undefined;
        textWithDefault?: string | undefined;
      }) => (
        <div>
          <span>Function Custom:</span>
          <span>{props.text}</span>
          <span>|</span>
          <span>{props.textWithDefault}</span>
        </div>
      )}
    />
    <hr />
    <TemplateDefaultValue compTemplate={CustomTemplate} />
  </div>
);

@ComponentBindings()
export class TemplateDefaultValueAppProps {}

@Component({
  view: viewFunction,
})
export default class TemplateDefaultValueApp extends JSXComponent(
  TemplateDefaultValueAppProps
) {}
