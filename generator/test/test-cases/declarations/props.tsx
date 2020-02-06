import { Component, Prop, Event } from "../../../component_declaration/common";

function view() { }
function viewModel() { }

@Component({
    viewModel: viewModel,
    view: view
})
export default class Widget {
    @OneWay() height: number = 10;
    @Event() onClick: (a:number) => null = () => null;

    getHeight():number { 
        this.onClick(10);
        return this.height;
    }
}
