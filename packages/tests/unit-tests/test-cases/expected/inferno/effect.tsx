import {
  InfernoEffect,
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/vdom";
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
  _currentState: {
    i: number;
    j: number;
    s: number;
  } | null = null;

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
        this.__state_s,
        this.props.sChange,
        this.i,
      ]),
      new InfernoEffect(this.onceEffect, []),
      new InfernoEffect(this.alwaysEffect, [
        this.i,
        this.j,
        this.props.p,
        this.props.r,
        this.__state_s,
        this.props.sChange,
        this.props.defaultS,
      ]),
    ];
  }
  updateEffects() {
    this._effects[0]?.update([
      this.props.p,
      this.__state_s,
      this.props.sChange,
      this.i,
    ]);
    this._effects[2]?.update([
      this.i,
      this.j,
      this.props.p,
      this.props.r,
      this.__state_s,
      this.props.sChange,
      this.props.defaultS,
    ]);
  }

  get i(): number {
    const state = this._currentState || this.state;
    return state.i;
  }
  set_i(value: () => number): any {
    this.setState((state: any) => {
      this._currentState = state;
      const newValue = value();
      this._currentState = null;
      return { i: newValue };
    });
  }
  get j(): number {
    const state = this._currentState || this.state;
    return state.j;
  }
  set_j(value: () => number): any {
    this.setState((state: any) => {
      this._currentState = state;
      const newValue = value();
      this._currentState = null;
      return { j: newValue };
    });
  }
  get __state_s(): number {
    const state = this._currentState || this.state;
    return this.props.s !== undefined ? this.props.s : state.s;
  }
  set_s(value: () => number): any {
    this.setState((state: any) => {
      this._currentState = state;
      const newValue = value();
      this.props.sChange!(newValue);
      this._currentState = null;
      return { s: newValue };
    });
  }

  setupData(): any {
    const id = subscribe(this.getP(), this.__state_s, this.i);
    this.set_i(() => 15);
    return () => unsubscribe(id);
  }
  onceEffect(): any {
    const id = subscribe(this.getP(), this.__state_s, this.i);
    this.set_i(() => 15);
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
      s: this.__state_s,
    };
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props, s: this.__state_s },
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
