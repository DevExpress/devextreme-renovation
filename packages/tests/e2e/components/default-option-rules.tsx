import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  TwoWay,
  Effect,
  Ref,
  RefObject,
} from "@devextreme-generator/declarations";

function view(model: DefaultOptionRulesComponent) {
  return (
    <div ref={model.host} {...model.restAttributes}>
      <span>{model.props.oneWayProp}</span>
      <span>{model.props.oneWayPropWithDefault}</span>
      <span>{model.props.oneWayPropWithExpressionDefault}</span>
      <span>{model.props.twoWayProp}</span>
      <span>{model.props.twoWayPropWithDefault}</span>
      <span>{model.props.arrayProp.join("")}</span>
      <span>{model.props.objectProp.val}</span>
      <span>{model.props.functionProp()}</span>
    </div>
  );
}

let currentLocale = 'en';

export function setLocale(value: string) {
    currentLocale = value;
}

function format(text: string) {
  return `${text}_${currentLocale}`;
}

@ComponentBindings()
export class Props {
  @OneWay() oneWayProp?: string;
  @OneWay() oneWayPropWithDefault?: string = "";
  @OneWay() oneWayPropWithExpressionDefault?: string = format('test');
  @TwoWay() twoWayProp?: number;
  @TwoWay() twoWayPropWithDefault: number = 3;
  @OneWay() arrayProp: string[] = ["arr"];
  @OneWay() objectProp?: any = { val: 1 };
  @OneWay() functionProp: () => string = () => "";
}

@Component({
  view,
  jQuery: {register: true},
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
