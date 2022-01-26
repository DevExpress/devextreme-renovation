import { createElement as h } from "inferno-compat";
import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/runtime/inferno";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export class Widget extends BaseInfernoComponent<any> {
  state = {};
  refs: any;

  constructor(props: any) {
    super(props);

    this.privateMethod = this.privateMethod.bind(this);
    this.method1 = this.method1.bind(this);
    this.method2 = this.method2.bind(this);
  }

  privateMethod(a: number): number {
    return a + this.props.prop1;
  }
  method1(a: number): number {
    return this.privateMethod(a);
  }
  method2(): null {
    return null;
  }

  render() {
    const { prop1 = 0 } = this.props;

    const { privateMethod, method1, method2 } = this;
    return <div></div>;
  }
}
