import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  Template,
} from "../../../../component_declaration/common";

@ComponentBindings()
export class CheckBoxProps {
  @Template() contentTemplate: JSXTemplate<any> = () => <div>jdfsfaaah</div>;
}
export const viewFunction = ({ props }: TestComponent): JSX.Element => {
  // const { contentTemplate: Cell } = props;
  const { contentTemplate: AnotherTemplate } = props;
  return <AnotherTemplate />;
};
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class TestComponent extends JSXComponent(CheckBoxProps) {}
