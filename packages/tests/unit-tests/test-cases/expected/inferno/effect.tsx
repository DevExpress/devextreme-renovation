import {
  InfernoEffect,
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/runtime/inferno";
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
export const WidgetInput: WidgetInputType = {
  p: "10",
  r: "20",
  defaultS: 10,
  sChange: () => {},
} as any as WidgetInputType;
import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends InfernoComponent<any> {
  state: { i: number; j: number; s: number };

  refs: any;

  constructor(props: any) {
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

  i!: number;
  j!: number;

  createEffects() {
    return [
      new InfernoEffect(this.setupData, [
        this.props.p,
        this.state.s,
        this.props.s,
        this.state.i,
      ]),
      new InfernoEffect(this.onceEffect, []),
      new InfernoEffect(this.alwaysEffect, [
        this.props,
        this.state.i,
        this.state.j,
        this.props.p,
        this.props.r,
        this.state.s,
        this.props.s,
        this.props.defaultS,
        this.props.sChange,
      ]),
    ];
  }
  updateEffects() {
    this._effects[0]?.update([
      this.props.p,
      this.state.s,
      this.props.s,
      this.state.i,
    ]);
    this._effects[2]?.update([
      this.props,
      this.state.i,
      this.state.j,
      this.props.p,
      this.props.r,
      this.state.s,
      this.props.s,
      this.props.defaultS,
      this.props.sChange,
    ]);
  }

  setupData(): any {
    const id = subscribe(
      this.getP(),
      this.props.s !== undefined ? this.props.s : this.state.s,
      this.state.i
    );
    this.setState((__state_argument: any) => ({ i: 15 }));
    return () => unsubscribe(id);
  }
  onceEffect(): any {
    const id = subscribe(
      this.getP(),
      this.props.s !== undefined ? this.props.s : this.state.s,
      this.state.i
    );
    this.setState((__state_argument: any) => ({ i: 15 }));
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
      s: this.props.s !== undefined ? this.props.s : this.state.s,
    } as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: {
        ...props,
        s: this.props.s !== undefined ? this.props.s : this.state.s,
      },
      i: this.state.i,
      j: this.state.j,
      getP: this.getP,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = WidgetInput;
