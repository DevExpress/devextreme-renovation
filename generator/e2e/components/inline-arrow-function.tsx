import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "../../component_declaration/common";
import ButtonWithTemplate from "./button-with-template";

function view(model: InlineArrowFunction) {
  return (
    <ButtonWithTemplate
      template={(props: { text?: string | undefined }) => (
        <div>InlineArrowTemplate{props.text}</div>
      )}
      text={" works"}
    />
  );
}

@ComponentBindings()
class InlineArrowFunctionProps {
  @OneWay() name?: string;
}

@Component({
  view,
})
export default class InlineArrowFunction extends JSXComponent(
  InlineArrowFunctionProps
) {}
