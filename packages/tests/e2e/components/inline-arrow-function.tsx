import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "@devextreme-generator/declarations";
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
  jQuery: {register: true},
})
export default class InlineArrowFunction extends JSXComponent(
  InlineArrowFunctionProps
) {}
