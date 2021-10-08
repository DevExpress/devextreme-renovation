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

import * as React from "react";
import { useCallback } from "react";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetProps & RestProps;
  internalInterfaceGetter: internalInterface;
  internalTypeGetter: internalType;
  externalInterfaceGetter: externalInterface;
  externalTypeGetter: externalType;
  restAttributes: RestProps;
}

function Widget(props: typeof WidgetProps & RestProps) {
  const __internalInterfaceGetter = useCallback(
    function __internalInterfaceGetter(): internalInterface {
      return { field1: { a: props.someProp }, field2: 2, field3: 3 };
    },
    [props.someProp]
  );
  const __internalTypeGetter = useCallback(
    function __internalTypeGetter(): internalType {
      return { a: "1" };
    },
    []
  );
  const __externalInterfaceGetter = useCallback(
    function __externalInterfaceGetter(): externalInterface {
      return { p: "" };
    },
    []
  );
  const __externalTypeGetter = useCallback(
    function __externalTypeGetter(): externalType {
      return { text: "", key: 0 };
    },
    []
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { someProp, type, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view();
}

Widget.defaultProps = WidgetProps;
