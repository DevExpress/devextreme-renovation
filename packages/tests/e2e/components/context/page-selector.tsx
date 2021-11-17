import {
  ComponentBindings,
  Component,
  JSXComponent,
  TwoWay,
  Event,
} from "@devextreme-generator/declarations";

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
  jQuery: {register: true},
})
export default class PageSelector extends JSXComponent(Props) {
  get add() {
    return () => {
      this.props.value = this.props.value + 1
    };
  }

  get sub() {
    return () => {
      this.props.value = this.props.value - 1
    };
  }
}
