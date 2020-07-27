import WidgetOne from "./component-pass-one";
import WidgetTwo from "./component-pass-two";

function view(model: Widget) {
  const ComponentByCondition = model.props.mode ? WidgetOne : WidgetTwo;
  const ComponentFromVar = WidgetOne;
  return (
    <React.Fragment>
      <ComponentByCondition text={model.props.firstText}>
        <div>Slot content</div>
      </ComponentByCondition>

      <ComponentFromVar text={model.props.secondText}>
        <div>Children go here</div>
      </ComponentFromVar>
    </React.Fragment>
  );
}

export declare type WidgetPropsType = {
  mode?: boolean;
  firstText?: string;
  secondText?: string;
};
export const WidgetProps: WidgetPropsType = {
  mode: false,
};
import React, { useCallback } from "react";

declare type RestProps = {
  className?: string;
  style?: React.CSSProperties;
  [x: string]: any;
};
interface Widget {
  props: typeof WidgetProps & RestProps;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetProps & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { firstText, mode, secondText, ...restProps } = props;
      return restProps;
    },
    [props]
  );
  return view({
    props: {
      ...props,
    },
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetProps,
};
