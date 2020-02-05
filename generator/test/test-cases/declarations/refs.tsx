import { Component, Ref, Listen } from "../../../component_declaration/common";

function view(viewModel) { 
    return <div ref={viewModel.divRef}></div>
}
function viewModel() { }
@Component({
    viewModel: viewModel,
    view: view
})
export default class Widget {
    @Ref() divRef!: HTMLDivElement;

    @Listen("click")
    clickHandler() {
        const html = this.divRef.outerHTML;
    }

    getHeight() { 
        return this.divRef.outerHTML;
    }
}
