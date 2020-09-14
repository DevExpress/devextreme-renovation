function view(model: InnerWidget) {
  return <div style={{ width: 100, height: 100 }}></div>;
}

export declare type InnerWidgetPropsType = {
  selected?: boolean;
  value: number;
  onSelect?: (e: any) => any;
  defaultValue?: number;
  valueChange?: (value: number) => void;
};
export const InnerWidgetProps: InnerWidgetPropsType = ({
  defaultValue: 14,
  valueChange: () => {},
} as any) as InnerWidgetPropsType;
import * as React from "react";
import { useState, useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof InnerWidgetProps
>;
interface InnerWidget {
  props: typeof InnerWidgetProps & RestProps;
  restAttributes: RestProps;
}

export default function InnerWidget(
  props: typeof InnerWidgetProps & RestProps
) {
  const [__state_value, __state_setValue] = useState<number>(() =>
    props.value !== undefined ? props.value : props.defaultValue!
  );

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        defaultValue,
        onSelect,
        selected,
        value,
        valueChange,
        ...restProps
      } = {
        ...props,
        value: props.value !== undefined ? props.value : __state_value,
      };
      return restProps;
    },
    [props, __state_value]
  );

  return view({
    props: {
      ...props,
      value: props.value !== undefined ? props.value : __state_value,
    },
    restAttributes: __restAttributes(),
  });
}

InnerWidget.defaultProps = {
  ...InnerWidgetProps,
};
