import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Template,
  JSXTemplate,
} from "@devextreme-generator/declarations";
import Button, { ButtonInput } from "./button";

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
export class Props extends ButtonInput {
  @OneWay() text: string = "Click Me";
  @Template() template?: JSXTemplate<{ text: string }>;
}

@Component({
  view,
  jQuery: {register: true},
})
export default class ButtonWithTemplate extends JSXComponent(Props) {}
