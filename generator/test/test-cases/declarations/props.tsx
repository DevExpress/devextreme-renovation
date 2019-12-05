
function view() { }
function viewModel() { }

@Component({
    viewModel: viewModel,
    view: view
})
export default class Component {
    @Prop() height: number = 10;
    @Event() onClick: (a:number) => null = () => null;

    getHeight() { 
        this.onClick();
        return this.height;
    }
}
