import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/runtime/inferno";

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
  }

  someState!: string;

  get someObj(): { stateField: string; propField: string } {
    if (this.__getterCache["someObj"] !== undefined) {
      return this.__getterCache["someObj"];
    }
    return (this.__getterCache["someObj"] = ((): {
      stateField: string;
      propField: string;
    } => {
      return {
        stateField: this.state.someState,
        propField: this.props.someProp,
      };
    })());
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
  get restAttributes(): RestProps {
    const { someProp, type, ...restProps } = this.props as any;
    return restProps;
  }
  __getterCache: {
    someObj?: { stateField: string; propField: string };
    someMethod3?: { stateField: string; propField: string };
  } = {};
  componentWillUpdate(nextProps, nextState, context) {
    if (
      this.state["someState"] !== nextState["someState"] ||
      this.props["someProp"] !== nextProps["someProp"]
    ) {
      this.__getterCache["someObj"] = undefined;
    }
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
