import { Component, ComponentBindings, JSXComponent, OneWay, Template } from "../../component_declaration/common";
import Button from "./button-with-template.tsx";
import ButtonTemplate from "./button-template.tsx";

function CustomTemplate (props: {text: string}) {
  return <span style={{ backgroundColor: "#aa0000"}}>{props.text}</span>
}

function view(model: TemplatePass) { 
    return <div>
      <Button
          text="Test Value"
          template={ButtonTemplate}
      />
      <Button
          text="Test Value"
          template={CustomTemplate}
      />
    </div>;
}

@ComponentBindings()
class Props { }

@Component({
    view
})
export default class TemplatePass extends JSXComponent(Props) {}
