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
export const WidgetProps: WidgetPropsType = {
  data: "data",
  union: "uniontext",
  obj: Object.freeze({ number: 123, text: "sda" }) as any,
  strArr: Object.freeze(["ba", "ab"]) as any,
  s: "",
  strDate: Object.freeze(new Date()) as any,
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
