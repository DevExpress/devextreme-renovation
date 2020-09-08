import {
  Component,
  ComponentBindings,
  JSXComponent,
  Template,
} from "../../../component_declaration/common";
import { Middle } from "./template-as-template-prop-middle";
import { Child } from "./template-as-template-prop-child";

export const viewFunction = ({
  props: { secondTemplate },
}: TemplateParent): JSX.Element => (
  <div>
    Template as Template Prop
    <Middle secondTemplate={secondTemplate} firstTemplate={Child} />
  </div>
);

@ComponentBindings()
export class TemplateParentProps {
  @Template() secondTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class TemplateParent extends JSXComponent(TemplateParentProps) {}
