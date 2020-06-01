import { Component, Ref, Listen, JSXComponent } from "../../../component_declaration/common";

function view(viewModel: Widget) { 
    return <div ref={viewModel.props.divRef as any}>
        <div ref={viewModel.props.explicitRef as any}>
            <div ref={viewModel.props.nullableRef as any}></div>
        </div>
    </div>
}

@ComponentBindings()
class WidgetInput { 
    @Ref() divRef!: HTMLDivElement;
    @Ref() nullableRef?: HTMLDivElement;
    @Ref() explicitRef!: HTMLDivElement;
}

@Component({
    view: view
})
export default class Widget extends JSXComponent<WidgetInput> {

    @Listen("click")
    clickHandler() {
        const html = this.props.divRef.outerHTML + this.props.explicitRef!.outerHTML;
    }

    getHeight() { 
        return this.props.divRef.outerHTML + this.props.nullableRef?.outerHTML;
    }
}
