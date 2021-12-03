import {
  Component,
  ComponentBindings,
  Slot,
  JSXComponent,
} from "@devextreme-generator/declarations";

function view(viewModel: SlotsWidget) {
  return (
    <div>
      <div>{viewModel.props.namedSlotWithSelector}</div>
      <div>{viewModel.props.namedSlot}</div>
      <div>{viewModel.props.children}</div>
    </div>
  );
}

@ComponentBindings()
class SlotsWidgetProps {
  @Slot() namedSlot?: JSX.Element;
  @Slot({ selector: '.namedSlot' }) namedSlotWithSelector?: JSX.Element;
  @Slot() children?: JSX.Element;
}
@Component({
  view: view,
})
export default class SlotsWidget extends JSXComponent(SlotsWidgetProps) { }
