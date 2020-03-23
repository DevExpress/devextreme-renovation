import { Component, Ref, Listen } from "../../../component_declaration/common";

function view(viewModel) { 
    return <div ref={viewModel.divRef}><div ref={viewModel.explicitRef}><div ref={viewModel.nullableRef}></div></div></div>
}
function viewModel() { }
@Component({
    viewModel: viewModel,
    view: view
})
export default class Widget {
    @Ref() divRef!: HTMLDivElement;
    @Ref() nullableRef?: HTMLDivElement;
    @Ref() explicitRef!: HTMLDivElement;

    @Listen("click")
    clickHandler() {
        const html = this.divRef.outerHTML + this.explicitRef!.outerHTML;
    }

    getHeight() { 
        return this.divRef.outerHTML + this.nullableRef?.outerHTML;
    }
}
