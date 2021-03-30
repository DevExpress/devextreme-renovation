import {
  Component,
  ComponentBindings,
  Slot,
  JSXComponent,
} from "@devextreme-generator/declarations";

function view(viewModel: Widget) {
  return (
    <div>
      <div>{viewModel.props.namedSlot}</div>
      <div>{viewModel.props.children}</div>
    </div>
  );
}

@ComponentBindings()
class WidgetInput {
  @Slot() namedSlot?: JSX.Element;
  @Slot() children?: JSX.Element;
}
@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {}
