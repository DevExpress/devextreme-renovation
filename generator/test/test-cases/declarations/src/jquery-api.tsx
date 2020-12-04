import {
  Component,
  ComponentBindings,
  OneWay,
  Ref,
  Method,
  JSXComponent,
  RefObject,
} from "../../../../component_declaration/common";

function view(viewModel: Widget) {
  return <div ref={viewModel.divRef as any}></div>;
}

export type MyType = {
  value: number;
};

export type MyTypeReturn = number;

@ComponentBindings()
class WidgetInput {
  @OneWay() prop1?: number;
  @OneWay() prop2?: number;
}

@Component({
  view: view,
  jQuery: { register: true },
})
export default class Widget extends JSXComponent(WidgetInput) {
  @Ref() divRef!: RefObject<HTMLDivElement>;

  @Method()
  getHeight(p: number = 10, p1: any): string {
    return `${this.props.prop1} + ${this.props.prop2} + ${this.divRef.innerHTML} + ${p}`;
  }

  @Method()
  getSize(): string {
    return `${this.props.prop1} + ${this.divRef.innerHTML}`;
  }

  @Method()
  getValue(arg: MyType): MyTypeReturn {
    return arg.value;
  }

  @Method()
  getValue2(arg: MyType): MyTypeReturn {
    return arg.value;
  }
}
