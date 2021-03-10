import {
  Component,
  ComponentBindings,
  JSXComponent,
  Template,
} from "@devextreme-generator/declaration";
export const viewFunction = ({
  props: { firstTemplate: First, secondTemplate },
}: Middle): JSX.Element => (
  <div>
    <First secondTemplate={secondTemplate} />
  </div>
);

@ComponentBindings()
export class MiddleProps {
  @Template() firstTemplate?: any;

  @Template() secondTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Middle extends JSXComponent(MiddleProps) {}
