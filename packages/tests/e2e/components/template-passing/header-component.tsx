import {
  Component,
  ComponentBindings,
  JSXComponent,
  Event,
  Fragment,
  OneWay,
} from "@devextreme-generator/declarations";
import Button from "../button";

function view({ props: { text, textWithDefault }, click }: HeaderComponent) {
  return (
    <Fragment>
      <span>{textWithDefault}</span>
      <span>{text}</span>
      <Button id="header-component-button" onClick={click}>
        Touch me!
      </Button>
    </Fragment>
  );
}

@ComponentBindings()
class HeaderComponentProps {
  @OneWay() text?: string;
  @OneWay() textWithDefault = "Header: ";
  @Event() onClick?: () => void;
}

@Component({
  view,
  jQuery: {register: true},
})
export class HeaderComponent extends JSXComponent(HeaderComponentProps) {
  click() {
    this.props.onClick?.();
  }
}
