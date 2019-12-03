function viewModel() {}

function view() {}

@Component({
    name: 'Component',
    view,
    viewModel,
})
export class Component {
    @Prop() type?: string;
    @Event() onClick

    @Listen("click")
    clickHandler() {
        this.onClick({ type: this.type });
    }
}
  