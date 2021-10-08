import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/runtime/inferno";
import { Item as externalType } from "./globals-in-template";
import { PropsI as externalInterface } from "./implements";

export declare type WidgetPropsType = {
  someProp: string;
  type?: string;
};
const WidgetProps: WidgetPropsType = {
  someProp: "",
  type: "",
};
interface internalInterface {
  field1: { a: string };
  field2: number;
  field3: number;
}
type internalType = { a: string };
const view = () => <div></div>;

import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

class Widget extends BaseInfernoComponent<any> {
  state = {};
  refs: any;

  constructor(props: any) {
    super(props);
  }

  get internalInterfaceGetter(): internalInterface {
    if (this.__getterCache["internalInterfaceGetter"] !== undefined) {
      return this.__getterCache["internalInterfaceGetter"];
    }
    return (this.__getterCache["internalInterfaceGetter"] =
      ((): internalInterface => {
        return { field1: { a: this.props.someProp }, field2: 2, field3: 3 };
      })());
  }
  get internalTypeGetter(): internalType {
    if (this.__getterCache["internalTypeGetter"] !== undefined) {
      return this.__getterCache["internalTypeGetter"];
    }
    return (this.__getterCache["internalTypeGetter"] = ((): internalType => {
      return { a: "1" };
    })());
  }
  get externalInterfaceGetter(): externalInterface {
    if (this.__getterCache["externalInterfaceGetter"] !== undefined) {
      return this.__getterCache["externalInterfaceGetter"];
    }
    return (this.__getterCache["externalInterfaceGetter"] =
      ((): externalInterface => {
        return { p: "" };
      })());
  }
  get externalTypeGetter(): externalType {
    if (this.__getterCache["externalTypeGetter"] !== undefined) {
      return this.__getterCache["externalTypeGetter"];
    }
    return (this.__getterCache["externalTypeGetter"] = ((): externalType => {
      return { text: "", key: 0 };
    })());
  }
  get restAttributes(): RestProps {
    const { someProp, type, ...restProps } = this.props as any;
    return restProps;
  }
  __getterCache: {
    internalInterfaceGetter?: internalInterface;
    internalTypeGetter?: internalType;
    externalInterfaceGetter?: externalInterface;
    externalTypeGetter?: externalType;
  } = {};
  componentWillUpdate(nextProps, nextState, context) {
    if (this.props["someProp"] !== nextProps["someProp"]) {
      this.__getterCache["internalInterfaceGetter"] = undefined;
    }
  }
  render() {
    const props = this.props;
    return view();
  }
}

Widget.defaultProps = WidgetProps;
