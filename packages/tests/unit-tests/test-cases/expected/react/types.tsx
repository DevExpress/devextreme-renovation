import {
  EnumType,
  Union,
  ObjType,
  StringArr,
  StringType,
  WidgetProps as ExternalWidgetProps,
} from "./types-external";
export const viewFunction = (viewModel: Widget) => {
  return <div></div>;
};

export declare type WidgetPropsType = {
  str: String;
  num: Number;
  bool: Boolean;
  arr: Array<any>;
  strArr: Array<String>;
  obj: Object;
  date: Date;
  func: Function;
  symbol: Symbol;
  externalEnum: EnumType;
  externalUnion: Union;
  externalObj: ObjType;
  externalArray: StringArr;
  externalString: StringType;
};
export const WidgetProps: WidgetPropsType = {
  str: "",
  num: 1,
  bool: true,
  arr: [],
  strArr: ["a", "b"],
  obj: {},
  date: new Date(),
  func: () => {},
  symbol: Symbol("x"),
  externalEnum: "data",
  externalUnion: 0,
  externalObj: { number: 0, text: "text" },
  externalArray: ["s1", "s2"],
  externalString: "someValue",
};
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
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetProps & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        arr,
        bool,
        date,
        externalArray,
        externalEnum,
        externalObj,
        externalString,
        externalUnion,
        func,
        num,
        obj,
        str,
        strArr,
        symbol,
        ...restProps
      } = props;
      return restProps;
    },
    [props]
  );

  return viewFunction({
    props: { ...props },
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetProps,
};
import { CustomType } from "./types-external";
export declare type BaseViewPropsTypeType = {
  strArr: Array<String>;
  customTypeField?: { name: string; customField: CustomType }[];
};
const BaseViewPropsType: BaseViewPropsTypeType = {
  strArr: WidgetProps.strArr,
};
