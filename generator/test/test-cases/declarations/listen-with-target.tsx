import { Component, Listen } from "../../../component_declaration/common";

function view() {}

@Component({
    name: 'Component',
    view
})
export class Widget {
    @Listen('pointerup', { target: document })
    onPointerUp() { }
    
    @Listen('scroll', { target: window })
    scrollHandler() {}
}
  