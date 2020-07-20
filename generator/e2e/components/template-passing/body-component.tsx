import {
  Component,
  ComponentBindings,
  JSXComponent,
  Event,
  Fragment,
  OneWay,
} from "../../../component_declaration/common";
import Button from "../button.tsx";

function view({ props: { text }, click }: BodyComponent) {
  return (
    <Fragment>
      <span>{text}</span>
      <Button id="body-component-button" onClick={click}>
        Push me!
      </Button>
    </Fragment>
  );
}

@ComponentBindings()
class BodyComponentProps {
  @OneWay() text?: string;
  @Event() onClick? = () => void 0;
}

@Component({
  view,
})
export default class BodyComponent extends JSXComponent(BodyComponentProps) {
  click() {
    this.props.onClick();
  }
}
