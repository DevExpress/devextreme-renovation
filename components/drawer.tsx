import './drawer.css';
@Component({
  name: 'Drawer',
  components: [],
  viewModel,
  view
})

export default class Drawer {
  @Prop() height?: string;
  @Prop() hint?: string;
  @Prop() width?: string;

  @State() opened?: boolean;

  @Slot() drawer: any;
  @Slot() default: any;

  @Listen()
  onClickHandler(e: any) {
    this.opened = false;

    const opened = this.opened;
    

    this.opened = opened;
  }
}

function viewModel(model: Drawer) {
  return {
    drawerCSS: ["dx-drawer-panel"]
      .concat(model.opened ? "dx-state-visible" : "dx-state-hidden")
      .join(" "),
    style: {
      width: model.width,
      height: model.height
    },
    ...model
  };
}

function view(viewModel: any) {
  return (
    <div
      class="dx-drawer"
      title={viewModel.hint}
      style={viewModel.style}>
      <div class={viewModel.drawerCSS}>
        { viewModel.drawer }
      </div>
      <div
        class="dx-drawer-content"
        click={viewModel.onClickHandler}>
        { viewModel.default }
      </div>
    </div>
  );
}

