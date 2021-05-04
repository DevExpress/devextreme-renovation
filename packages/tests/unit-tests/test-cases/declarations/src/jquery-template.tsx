import {
  Component,
  Template,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declarations";

@ComponentBindings()
export class WidgetInput {
  @Template() template: () => any = () => <div></div>;
  @Template() anotherTemplate: () => any = () => <div></div>;
}

@Component({
  view: view,
  jQuery: { register: true },
})
export default class Widget extends JSXComponent(WidgetInput) {}

function view(viewModel: Widget):JSX.Element|null {
  return (
    <div>
      <viewModel.props.template />
      <viewModel.props.anotherTemplate />
    </div>
  );
}
