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

    getHeight() { 
        return this.divRef.outerHTML;
    }
}
