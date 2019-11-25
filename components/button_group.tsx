import Button from "./button";
import './button_group.css'

@Component({
  name: 'ButtonGroup',
  components: ['Button']
})

export class ButtonGroup {
  @Prop() height: string;
  @Prop() hint: string;
  @Prop() items: any[];
  @Prop() keyExpr: string;
  @Prop() selectionMode: string;
  @Prop() stylingMode: string;
  @Prop() width: string;

  @State() selectedItems: string[];

  @Listen()
  onClickHandler(index: number) {
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
  viewModel(model: any) {
    const viewModel = { ...model };
    viewModel.items = viewModel.items.map((item: any, i: number, array: any[]) => ({
      ...item,
      pressed: (model.selectedItems || []).indexOf(item[model.keyExpr]) !== -1,
      classNames: [i === 0 && "first" || (i === array.length - 1) && "last" || ""]
    }))

    return viewModel;
  }

  @View()
  view(viewModel: any) {
    const buttons = viewModel.items.map((item: any, index: number) => (
      <Button
        stylingMode={viewModel.stylingMode}
        key={item.key}
        pressed={item.pressed}
        text={item.text}
        type={item.type}
        hint={item.hint || viewModel.hint}
        onClick={viewModel.onClickHandler.bind(this, index)}>
        </Button>
    ));

    return (
      <div className="dx-button-group">
        {buttons}
      </div>
    );
  }
}
