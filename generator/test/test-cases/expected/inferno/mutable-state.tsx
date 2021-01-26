import { InfernoEffect } from "../../../../modules/inferno/effect";
import { InfernoComponent } from "../../../../modules/inferno/base_component";
function view(viewModel: Widget) {
  return <div></div>;
}

export declare type WidgetInputType = {};
const WidgetInput: WidgetInputType = {};
import { createElement as h } from "inferno-compat";
import { createRef as infernoCreateRef } from "inferno";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends InfernoComponent<
  typeof WidgetInput & RestProps
> {
  state = {};
  refs: any;
  obj!: { value?: number };
  notDefinedObj?: { value?: number };
  definedObj: { value?: number } = { value: 0 };

  constructor(props: typeof WidgetInput & RestProps) {
    super(props);

    this.setObj = this.setObj.bind(this);
    this.getValue = this.getValue.bind(this);
    this.getObj = this.getObj.bind(this);
    this.initialize = this.initialize.bind(this);
  }

  createEffects() {
    return [new InfernoEffect(this.initialize, [])];
  }
  updateEffects() {
    this._effects[0]?.update([]);
  }

  initialize(): any {
    this.setObj();
  }
  setObj(): any {
    this.obj.value = 0;
    this.definedObj.value = 0;
    this.notDefinedObj = this.notDefinedObj || {};
    this.notDefinedObj.value = 0;
  }
  getValue(): any {
    const a: number = this.obj.value ?? 0;
    const b: number = this.notDefinedObj?.value ?? 0;
    const c: number = this.definedObj.value ?? 0;
    return a + b + c;
  }
  getObj(): any {
    return this.obj;
  }
  get restAttributes(): RestProps {
    const { ...restProps } = this.props;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      setObj: this.setObj,
      getValue: this.getValue,
      getObj: this.getObj,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = {
  ...WidgetInput,
};
