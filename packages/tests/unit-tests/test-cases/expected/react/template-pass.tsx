import WidgetWithTemplate from "./dx-widget-with-template";
import InnerWidget from "./dx-inner-widget";
const CustomTemplate = ({ text }: { text: string; value: number }) => {
  return <span>{text}</span>;
};
function view(model: Widget) {
  return (
    <WidgetWithTemplate
      template={CustomTemplate}
      componentTemplate={InnerWidget}
      arrowTemplate={(data: { name: string; id: number }) => (
        <div>{data.name}</div>
      )}
    />
  );
}

export declare type WidgetPropsType = {};
export const WidgetProps: WidgetPropsType = {};
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
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}

Widget.defaultProps = {
  ...WidgetProps,
};
