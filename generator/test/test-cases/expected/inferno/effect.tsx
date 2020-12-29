import { InfernoEffect } from "../../../../modules/inferno/effect";
import { InfernoComponent } from "../../../../modules/inferno/base_component";
function view(model: Widget) {
  return <div></div>;
}
function subscribe(p: string, s: number, i: number) {
  return 1;
}
function unsubscribe(id: number) {
  return undefined;
}

export declare type WidgetInputType = {
  p: string;
  r: string;
  s: number;
  defaultS: number;
  sChange?: (s: number) => void;
};
export const WidgetInput: WidgetInputType = ({
  p: "10",
  r: "20",
  defaultS: 10,
  sChange: () => {},
} as any) as WidgetInputType;
import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends InfernoComponent<
  typeof WidgetInput & RestProps
> {
  state: {
    i: number;
    j: number;
    s: number;
  };
  refs: any;

  constructor(props: typeof WidgetInput & RestProps) {
    super(props);
    this.state = {
      i: 10,
      j: 20,
      s: this.props.s !== undefined ? this.props.s : this.props.defaultS,
    };
    this.setupData = this.setupData.bind(this);
    this.onceEffect = this.onceEffect.bind(this);
    this.alwaysEffect = this.alwaysEffect.bind(this);
    this.getP = this.getP.bind(this);
  }

  createEffects() {
    return [
      new InfernoEffect(this.setupData, [
        this.props.p,
        this.s,
        this.props.sChange,
        this.i,
      ]),
      new InfernoEffect(this.onceEffect, []),
      new InfernoEffect(this.alwaysEffect, [
        this.i,
        this.j,
        this.props.p,
        this.props.r,
        this.s,
        this.props.sChange,
        this.props.defaultS,
      ]),
    ];
  }
  updateEffects() {
    this._effects[0].update([this.props.p, this.s, this.props.sChange, this.i]);
    this._effects[2].update([
      this.i,
      this.j,
      this.props.p,
      this.props.r,
      this.s,
      this.props.sChange,
      this.props.defaultS,
    ]);
  }

  get i(): number {
    return this.state.i;
  }
  set i(value: number) {
    this.setState({ i: value });
  }
  get j(): number {
    return this.state.j;
  }
  set j(value: number) {
    this.setState({ j: value });
  }
  get s(): number {
    return this.props.s !== undefined ? this.props.s : this.state.s;
  }
  set s(value: number) {
    this.setState({ s: value });
    this.props.sChange!(value);
  }

  setupData(): any {
    const id = subscribe(this.getP(), this.s, this.i);
    this.i = 15;
    return () => unsubscribe(id);
  }
  onceEffect(): any {
    const id = subscribe(this.getP(), this.s, this.i);
    this.i = 15;
    return () => unsubscribe(id);
  }
  alwaysEffect(): any {
    const id = subscribe(this.getP(), 1, 2);
    return () => unsubscribe(id);
  }
  getP(): any {
    return this.props.p;
  }
  get restAttributes(): RestProps {
    const { defaultS, p, r, s, sChange, ...restProps } = {
      ...this.props,
      s: this.s,
    };
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props, s: this.s },
      i: this.i,
      j: this.j,
      getP: this.getP,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = {
  ...WidgetInput,
};