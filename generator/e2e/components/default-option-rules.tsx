import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  TwoWay,
  Effect,
  Ref,
  RefObject,
} from "../../component_declaration/common";

function view(model: DefaultOptionRulesComponent) {
  return (
    <div ref={model.host} {...model.restAttributes}>
      <span>{model.props.oneWayProp}</span>
      <span>{model.props.oneWayPropWithDefault}</span>
      <span>{model.props.twoWayProp}</span>
      <span>{model.props.twoWayPropWithDefault}</span>
      <span>{model.props.arrayProp.join("")}</span>
      <span>{model.props.objectProp.val}</span>
      <span>{model.props.functionProp()}</span>
    </div>
  );
}

@ComponentBindings()
export class Props {
  @OneWay() oneWayProp?: string;
  @OneWay() oneWayPropWithDefault?: string = "";
  @TwoWay() twoWayProp?: number;
  @TwoWay() twoWayPropWithDefault: number = 3;
  @OneWay() arrayProp: string[] = ["arr"];
  @OneWay() objectProp?: any = { val: 1 };
  @OneWay() functionProp: () => string = () => "";
}

@Component({
  view,
})
export default class DefaultOptionRulesComponent extends JSXComponent(Props) {
  @Ref() host!: RefObject<HTMLDivElement>;
  @Effect()
  onClick() {
    const handler = () => {
      this.props.twoWayProp = this.props.twoWayProp
        ? this.props.twoWayProp + 1
        : 0;
      this.props.twoWayPropWithDefault = this.props.twoWayPropWithDefault + 1;
    };
    this.host.current?.addEventListener("click", handler);

    return () => this.host.current?.removeEventListener("click", handler);
  }
}
