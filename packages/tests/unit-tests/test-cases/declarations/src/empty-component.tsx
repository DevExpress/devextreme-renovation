import { Component, OneWay } from "../../../../component_declaration/common";
@Component({
  view: view1,
  defaultOptionRules: null,
})
export default class Widget {
  @OneWay() height?: number;
  @OneWay() width?: number;
}

function view1(viewModel: Widget) {
  return (
    <div style={{ height: viewModel.height }}>
      <span></span>
      <span></span>
    </div>
  );
}
