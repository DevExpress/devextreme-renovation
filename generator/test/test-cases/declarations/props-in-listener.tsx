function viewModel() {}

function view() {}

@Component({
    name: 'Component',
    view,
    viewModel,
})
export class Component {
    @OneWay() type?: string;
    @Event() onClick?: ()=>void

    @Listen("click")
    clickHandler() {
        this.onClick!({ type: this.type });
    }
}
  