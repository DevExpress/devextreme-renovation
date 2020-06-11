import { Component, JSXComponent } from "../../component_declaration/common";
import Button, { ButtonInput } from "./button.tsx";

function view(model: Widget) { 
    return <Button {...model.props}/>
}

@Component({ view })
export default class Widget extends JSXComponent(ButtonInput) {
    
}
