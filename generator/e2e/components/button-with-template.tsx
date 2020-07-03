import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Template,
} from "../../component_declaration/common";
import Button, { ButtonInput } from "./button.tsx";

function view(model: ButtonWithTemplate) {
  return (
    <Button id={model.props.id} onClick={model.props.onClick}>
      {model.props.template ? (
        <model.props.template text={model.props.text} />
      ) : (
        model.props.text
      )}
    </Button>
  );
}

@ComponentBindings()
class Props extends ButtonInput {
  @OneWay() text?: string = "Click Me";
  @Template() template?: (props: { text: string }) => any;
}

@Component({
  view,
})
export default class ButtonWithTemplate extends JSXComponent(Props) {}
