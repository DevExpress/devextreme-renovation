import {
  ComponentBindings,
  Component,
  JSXComponent,
  TwoWay,
  Event,
} from "../../../component_declaration/common";

import Button from "../button";

function view({ props: { value }, add, sub }: PageSelector) {
  return (
    <div className="page-selector" style={{ display: "inline-block" }}>
      <span className="sub">
        <Button onClick={sub}>{"<"}</Button>
      </span>
      <span className="value">{value}</span>
      <span className="add">
        <Button onClick={add}>{">"}</Button>
      </span>
    </div>
  );
}

@ComponentBindings()
class Props {
  @TwoWay() value = 1;
  @Event() valueChange?: (e: number) => void;
}

@Component({
  view,
})
export default class PageSelector extends JSXComponent(Props) {
  get add() {
    return () => (this.props.value = this.props.value + 1);
  }

  get sub() {
    return () => (this.props.value = this.props.value - 1);
  }
}
