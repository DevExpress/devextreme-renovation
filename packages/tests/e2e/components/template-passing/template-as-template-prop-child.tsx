import {
  Component,
  ComponentBindings,
  JSXComponent,
  Template,
} from "@devextreme-generator/declarations";
export const viewFunction = ({
  props: { secondTemplate: Second },
}: Child): JSX.Element => (
  <div>
    FirstTemplateText
    <Second />
  </div>
);

@ComponentBindings()
export class ChildProps {
  @Template() secondTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: {register: true},
})
export class Child extends JSXComponent(ChildProps) {}
