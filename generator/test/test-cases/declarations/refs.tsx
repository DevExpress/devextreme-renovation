function view(viewModel) { 
    return <div ref={viewModel.divRef}></div>
}
function viewModel() { }
@Component({
    viewModel: viewModel,
    view: view
})
export default class Component {
    @Ref() divRef!: HTMLDivElement;

    @Listen("click")
    clickHandler() {
        const html = this.divRef.outerHTML;
    }

    getHeight() { 
        return this.divRef.outerHTML;
    }
}
