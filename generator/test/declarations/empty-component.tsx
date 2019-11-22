@Component({
    name: 'ComponentName'
})
export class Component {
    @Prop() height: Number;

    @ViewModel()
    viewModel() {}

    @View()
    view() {}
}
  