import Button from "./button";
import './button_group.css'

@Component({
  name: 'ButtonGroup',
  components: [Button],
  viewModel: viewModelFunction,
  view: viewFunction
})

export default class ButtonGroup {
  @Prop() height?: string;
  @Prop() hint?: string;
  @Prop() items?: any[] = [];
  @Prop() keyExpr?: string = "";
  @Prop() selectionMode?: string;
  @Prop() stylingMode?: string;
  @Prop() width?: string;

  @State() selectedItems?: string[] = [];

  @Listen()
  onClickHandler(index: number) {
    const currentButton = this.items![index][this.keyExpr!]
    let newValue: string[] = [];

    if (this.selectionMode === "single") {
      if (this.selectedItems![0] !== currentButton) {
        newValue = [currentButton];
      }
    } else {
      if (this.selectedItems!.indexOf(currentButton) !== -1) {
        newValue = this.selectedItems!.filter(item => item !== currentButton);
      } else {
        newValue = this.selectedItems!.concat(currentButton);
      }
    }
    this.selectedItems = newValue;
  }
}

function viewModelFunction(model: ButtonGroup) {
  const viewModel = { ...model };
  viewModel.items = viewModel.items!.map((item: any, i: number, array: any[]) => ({
    ...item,
    pressed: (model.selectedItems || []).indexOf(item[model.keyExpr!]) !== -1,
    classNames: [i === 0 && "first" || (i === array.length - 1) && "last" || ""]
  }))

  return viewModel;
}

function viewFunction(viewModel: any) {
  const buttons = viewModel.items.map((item: any, index: number) => (
    <Button
      stylingMode={viewModel.stylingMode}
      key={item.key}
      pressed={item.pressed}
      text={item.text}
      type={item.type}
      hint={item.hint || viewModel.hint}
      onClick={viewModel.onClickHandler.bind(null, index)}>
    </Button>
  ));

  return (
    <div className="dx-button-group">
      {buttons}
    </div>
  );
}

