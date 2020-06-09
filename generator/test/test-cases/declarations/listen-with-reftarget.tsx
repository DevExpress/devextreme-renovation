import { Component, Listen,  Ref } from "../../../component_declaration/common";


function view() {}

@Component({
    view
})
export class Widget {
    @Ref() divRef!: HTMLDivElement;

    @Listen('pointerup', { target: 'divRef' })
    onPointerUp() { }
}
  