import {
  Component,
  ComponentBindings,
  JSXComponent,
  Template,
} from "@devextreme-generator/declarations";
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
  jQuery: {register: true},
})
export default class TemplateParent extends JSXComponent(TemplateParentProps) {}
