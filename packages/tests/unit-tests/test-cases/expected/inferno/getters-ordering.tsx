import {
  InfernoEffect,
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from '@devextreme/runtime/inferno';

export type WidgetPropsType = {
  someProp: string;
  type?: string;
  gridCompatibility?: boolean;
  pageIndex: number;
  defaultPageIndex: number;
  pageIndexChange?: (pageIndex: number) => void;
};
const WidgetProps: WidgetPropsType = {
  someProp: '',
  type: '',
  gridCompatibility: true,
  defaultPageIndex: 1,
  pageIndexChange: () => {},
} as any as WidgetPropsType;
const view = (model: Widget) => <div></div>;

import { createElement as h } from 'inferno-compat';
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

class Widget extends InfernoComponent<any> {
  state: { someState: number; pageIndex: number };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      someState: 0,
      pageIndex:
        this.props.pageIndex !== undefined
          ? this.props.pageIndex
          : this.props.defaultPageIndex,
    };
    this.factorial = this.factorial.bind(this);
    this.g3 = this.g3.bind(this);
    this.someEffect = this.someEffect.bind(this);
    this.pageIndexChange = this.pageIndexChange.bind(this);
    this.someMethod = this.someMethod.bind(this);
    this.recursive1 = this.recursive1.bind(this);
    this.recursive2 = this.recursive2.bind(this);
  }

  someState!: number;

  createEffects() {
    return [
      new InfernoEffect(this.someEffect, [
        this.props.someProp,
        this.props.type,
      ]),
    ];
  }
  updateEffects() {
    this._effects[0]?.update([this.props.someProp, this.props.type]);
  }

  someEffect(): any {
    return () => this.g7;
  }
  get g7(): any {
    return this.g6;
  }
  get g5(): (string | undefined)[] {
    if (this.__getterCache['g5'] !== undefined) {
      return this.__getterCache['g5'];
    }
    return (this.__getterCache['g5'] = ((): (string | undefined)[] => {
      return [...this.g3(), this.g2];
    })());
  }
  get g1(): any {
    return this.props.someProp;
  }
  get g2(): any {
    return this.props.type;
  }
  factorial(n: number): number {
    return n > 1 ? this.factorial(n - 1) : 1;
  }
  get g4(): (string | undefined)[] {
    if (this.__getterCache['g4'] !== undefined) {
      return this.__getterCache['g4'];
    }
    return (this.__getterCache['g4'] = ((): (string | undefined)[] => {
      return [...this.g3(), this.g1];
    })());
  }
  get g6(): (string | undefined)[] {
    if (this.__getterCache['g6'] !== undefined) {
      return this.__getterCache['g6'];
    }
    return (this.__getterCache['g6'] = ((): (string | undefined)[] => {
      return [...this.g5, ...this.g4];
    })());
  }
  get type(): any {
    return this.props.type;
  }
  pageIndexChange(newPageIndex: number): void {
    if (this.props.gridCompatibility) {
      {
        let __newValue;
        this.setState((__state_argument: any) => {
          __newValue = newPageIndex + 1;
          return { pageIndex: __newValue };
        });
        this.props.pageIndexChange!(__newValue);
      }
    } else {
      {
        let __newValue;
        this.setState((__state_argument: any) => {
          __newValue = newPageIndex;
          return { pageIndex: __newValue };
        });
        this.props.pageIndexChange!(__newValue);
      }
    }
  }
  someMethod(): any {
    return undefined;
  }
  recursive1(): void {
    this.setState((__state_argument: any) => ({
      someState: this.recursive2(),
    }));
  }
  recursive2(): number {
    return requestAnimationFrame(this.recursive1);
  }
  get restAttributes(): RestProps {
    const {
      defaultPageIndex,
      gridCompatibility,
      pageIndex,
      pageIndexChange,
      someProp,
      type,
      ...restProps
    } = {
      ...this.props,
      pageIndex:
        this.props.pageIndex !== undefined
          ? this.props.pageIndex
          : this.state.pageIndex,
    } as any;
    return restProps;
  }
  g3(): (string | undefined)[] {
    return [this.g1, this.g2];
  }
  __getterCache: {
    g5?: (string | undefined)[];
    g4?: (string | undefined)[];
    g6?: (string | undefined)[];
  } = {};
  componentWillUpdate(nextProps, nextState, context) {
    super.componentWillUpdate();
    if (
      this.props['someProp'] !== nextProps['someProp'] ||
      this.props['type'] !== nextProps['type']
    ) {
      this.__getterCache['g5'] = undefined;
    }
    if (
      this.props['someProp'] !== nextProps['someProp'] ||
      this.props['type'] !== nextProps['type']
    ) {
      this.__getterCache['g4'] = undefined;
    }
    if (
      this.props['someProp'] !== nextProps['someProp'] ||
      this.props['type'] !== nextProps['type']
    ) {
      this.__getterCache['g6'] = undefined;
    }
  }
  render() {
    const props = this.props;
    return view({
      props: {
        ...props,
        pageIndex:
          this.props.pageIndex !== undefined
            ? this.props.pageIndex
            : this.state.pageIndex,
      },
      someState: this.state.someState,
      g7: this.g7,
      g5: this.g5,
      g1: this.g1,
      g2: this.g2,
      factorial: this.factorial,
      g4: this.g4,
      g6: this.g6,
      type: this.type,
      pageIndexChange: this.pageIndexChange,
      someMethod: this.someMethod,
      recursive1: this.recursive1,
      recursive2: this.recursive2,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = WidgetProps;
