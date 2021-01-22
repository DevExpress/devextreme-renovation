import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  Template,
} from "../../../../component_declaration/common";

@ComponentBindings()
export class Props {
  @Template() contentTemplate: JSXTemplate<any> = () => <div />;
}
export const viewFunction = ({ props }: TestComponent): JSX.Element => {
  const { contentTemplate: AnotherTemplate } = props;
  return <AnotherTemplate />;
};
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class TestComponent extends JSXComponent(Props) {}
