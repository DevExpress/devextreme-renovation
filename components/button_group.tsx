import Button from "./button";
import './button_group.css'

@Component({
  name: 'ButtonGroup',
  components: ['Button']
})

export class ButtonGroup {
  @Prop() height: String;
  @Prop() hint: String;
  @Prop() items: Array<any>;
  @Prop() keyExpr: String;
  @Prop() selectionMode: String;
  @Prop() stylingMode: String;
  @Prop() width: String;

  @State() selectedItems: Array<String>;

  @Listen()
  onClickHandler(index) {
    const currentButton = this.items[index][this.keyExpr]; 
    if(this.selectionMode === "single") {
      if(this.selectedItems[0] === currentButton) {
        this.selectedItems = [];
      } else {
        this.selectedItems = [currentButton];
      }
    } else {
      if(this.selectedItems.indexOf(currentButton) !== -1) {
        this.selectedItems = this.selectedItems.filter(item => item !== currentButton);
      } else {
        this.selectedItems = this.selectedItems.concat(currentButton);
      }
    }
  }

  @ViewModel()
  viewModel(model) {
    const viewModel = { ...model };
    viewModel.items = viewModel.items.map((item, i, array) => ({
      ...item,
      pressed: (model.selectedItems || []).indexOf(item[model.keyExpr]) !== -1,
      classNames: [i === 0 && "first" || (i === array.length - 1) && "last" || ""]
    }))

    return viewModel;
  }

  @View()
  view(viewModel) {
    const buttons = viewModel.items.map((item, index) => (
      <Button
        stylingMode={viewModel.stylingMode}
        key={item.key}
        pressed={item.pressed}
        text={item.text}
        type={item.type}
        hint={item.hint || viewModel.hint}
        onClick={this.onClickHandler.bind(this, index)}>
          <Button.Icon></Button.Icon>
          <Icon></Icon>
        </Button>
        
    ));

    return (
      <div className="dx-button-group">
        {buttons}
      </div>
    );
  }
}
