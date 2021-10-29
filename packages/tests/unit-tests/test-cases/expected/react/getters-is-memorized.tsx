import {
  InterfaceTemplateInput as externalInterface,
  Options as externalType,
} from "./types.d";

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
import { useCallback, useMemo } from "react";

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
  const __internalInterfaceGetter = useMemo(
    function __internalInterfaceGetter(): internalInterface {
      return { field1: { a: props.someProp }, field2: 2, field3: 3 };
    },
    [props.someProp]
  );
  const __internalTypeGetter = useMemo(
    function __internalTypeGetter(): internalType {
      return { a: "1" };
    },
    []
  );
  const __externalInterfaceGetter = useMemo(
    function __externalInterfaceGetter(): externalInterface {
      return { inputInt: 2 };
    },
    []
  );
  const __externalTypeGetter = useMemo(
    function __externalTypeGetter(): externalType {
      return { value: "" };
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
