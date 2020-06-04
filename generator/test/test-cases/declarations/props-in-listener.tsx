import { Component, ComponentBindings, JSXComponent, OneWay, Event, Listen } from "../../../component_declaration/common";


function view(model: Widget) {
    return <div></div>
 }

@ComponentBindings()
export class Props { 
    @OneWay() type?: string;
    @Event() onClick?: (e: any) => void;
}

@Component({
    name: 'Component',
    view
})
export default class Widget extends JSXComponent(Props){
   
    @Listen("click")
    clickHandler() {
        this.props.onClick!({ type: this.props.type });
    }
}
  