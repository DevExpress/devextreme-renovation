export declare type EnumType = "data" | "none";
export declare type Union = string | number;
export declare type ObjType = { number: number; text: string };
export declare type StringArr = Array<String>;
export declare type StringType = String;
export declare type StrDate = string | Date;
export const viewFunction = (viewModel: Widget) => {
  return <div></div>;
};

export declare type WidgetPropsType = {
  data: EnumType;
  union: Union;
  obj: ObjType;
  strArr: StringArr;
  s: StringType;
  strDate: StrDate;
  customTypeField?: { name: string; customField: CustomType }[];
};
export const WidgetProps: WidgetPropsType = Object.defineProperties(
  {
    data: "data",
    union: "uniontext",
    strArr: {
      enumerable: true,
      get: function () {
        return ["ba", "ab"];
      },
    },
    s: "",
  },
  {
    obj: {
      enumerable: true,
      get: function () {
        return { number: 123, text: "sda" };
      },
    },
    strDate: {
      enumerable: true,
      get: function () {
        return new Date();
      },
    },
  }
);
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
        customTypeField,
        data,
        obj,
        s,
        strArr,
        strDate,
        union,
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

Widget.defaultProps = WidgetProps;

export interface CustomType {
  name: string;
  value: number;
}
