import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Template,
} from "@devextreme-generator/declaration";
import Button from "./button-with-template";
import ButtonTemplate from "./button-template";

function CustomTemplate(props: { text: string }) {
  return <span style={{ backgroundColor: "#aa0000" }}>{props.text}</span>;
}

function view(model: TemplatePass) {
  return (
    <div>
      <Button text="Test Value" template={ButtonTemplate} />
      <Button text="Test Value" template={CustomTemplate} />
    </div>
  );
}

@ComponentBindings()
class Props {}

@Component({
  view,
})
export default class TemplatePass extends JSXComponent(Props) {}
