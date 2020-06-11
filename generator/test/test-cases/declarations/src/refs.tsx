import { Component, Ref, Listen } from "../../../../component_declaration/common";

function view(viewModel: Widget) { 
    return <div ref={viewModel.divRef as any}>
        <div ref={viewModel.explicitRef as any}>
            <div ref={viewModel.nullableRef as any}></div>
        </div>
    </div>
}

@Component({
    view: view
})
export default class Widget {
    @Ref() divRef!: HTMLDivElement;
    @Ref() nullableRef?: HTMLDivElement;
    @Ref() explicitRef!: HTMLDivElement;

    clickHandler() {
        const html = this.divRef.outerHTML + this.explicitRef!.outerHTML;
    }

    getHeight() { 
        return this.divRef.outerHTML + this.nullableRef?.outerHTML;
    }
}
