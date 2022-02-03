const buttonClass = "my-buttom";

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

export default class Button extends BaseInfernoComponent<any> {
  state = {};
  refs: any;

  constructor(props: any) {
    super(props);
  }

  get classes(): any {
    return this.props.className
      ? `${buttonClass} ${this.props.className}`
      : buttonClass;
  }

  render() {
    const { className } = this.props;

    const { classes } = this;
    return <button className={classes}>My Button</button>;
  }
}
