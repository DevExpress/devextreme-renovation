@Component({
    name: 'ComponentName'
})
export default class Component {
    @Prop() height: Number;

    @ViewModel()
    viewModel() {}

    @View()
    view() {}
}
  