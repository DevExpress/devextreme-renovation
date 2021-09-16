import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/vdom";

export declare type WidgetPropsType = {
  someProp: string;
  type?: string;
};
const WidgetProps: WidgetPropsType = {
  someProp: "",
  type: "",
};
interface FirstGetter {
  field1: string;
  field2: number;
  field3: number;
}
const view = () => <div></div>;

import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

class Widget extends BaseInfernoComponent<any> {
  state: { someState: string };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      someState: "",
    };
    this.someMethod2 = this.someMethod2.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  someState!: string;

  get someObj(): any {
    return { stateField: this.state.someState, propField: this.props.someProp };
  }
  get someObj1(): any {
    const { propField, stateField } = this.someObj;
    return { stateField, propField };
  }
  get someMethod(): { stateField: string; propField: string } {
    if (this.__getterCache["someMethod"] !== undefined) {
      return this.__getterCache["someMethod"];
    }
    return (this.__getterCache["someMethod"] = ((): {
      stateField: string;
      propField: string;
    } => {
      const { propField, stateField } = this.someObj1;
      return { stateField, propField };
    })());
  }
  someMethod2(): any {
    const state = this.someObj.stateField;
    const prop = this.someObj.propField;
  }
  get someMethod3(): { stateField: string; propField: string } {
    if (this.__getterCache["someMethod3"] !== undefined) {
      return this.__getterCache["someMethod3"];
    }
    return (this.__getterCache["someMethod3"] = ((): {
      stateField: string;
      propField: string;
    } => {
      const something = this.someObj;
      return something;
    })());
  }
  get emptyMethod(): any {
    return "";
  }
  get restAttributes(): RestProps {
    const { someProp, type, ...restProps } = this.props as any;
    return restProps;
  }
  changeState(newValue: string): any {
    this.setState((__state_argument: any) => ({ someState: newValue }));
  }
  __getterCache: {
    someMethod?: { stateField: string; propField: string };
    someMethod3?: { stateField: string; propField: string };
  } = {};
  componentWillUpdate(nextProps, nextState, context) {
    if (
      this.state["someState"] !== nextState["someState"] ||
      this.props["someProp"] !== nextProps["someProp"]
    ) {
      this.__getterCache["someMethod3"] = undefined;
    }
  }
  render() {
    const props = this.props;
    return view();
  }
}

Widget.defaultProps = WidgetProps;
