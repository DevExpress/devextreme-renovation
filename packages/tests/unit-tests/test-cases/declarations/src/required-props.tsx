import {
  Component,
  OneWay,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declarations";

function view() {}

@ComponentBindings()
class WidgetInput {
  @OneWay() size!: {
    width: number;
    height: number;
  };

  @OneWay() typeProp!: string;
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent<
  WidgetInput,
  "size" | "typeProp"
>() {
  get getHeight(): number {
    return this.props.size.height;
  }

  get type(): string {
    const { typeProp } = this.props;
    return typeProp;
  }
}
