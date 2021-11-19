import {
  Component,
  ComponentBindings,
  JSXComponent,
  Event,
  Fragment,
  OneWay,
  TwoWay,
} from "@devextreme-generator/declarations";
import Button from "../button";

function view({
  props: { text, textWithDefault, counter },
  click,
}: BodyComponent) {
  return (
    <Fragment>
      <span>{textWithDefault}</span>
      <span>
        {counter} - {text}
      </span>
      <Button id="body-component-button" onClick={click}>
        Push me!
      </Button>
    </Fragment>
  );
}

@ComponentBindings()
class BodyComponentProps {
  @OneWay() text?: string;
  @OneWay() textWithDefault = "Body: ";
  @TwoWay() counter = 13;
  @Event() onClick?: () => void;
}

@Component({
  view,
  jQuery: {register: true},
})
export default class BodyComponent extends JSXComponent(BodyComponentProps) {
  click() {
    this.props.counter = this.props.counter + 1;
    this.props.onClick?.();
  }
}
