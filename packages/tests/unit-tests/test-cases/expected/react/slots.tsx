function view(viewModel: SlotsWidget) {
  return (
    <div>
      <div>{viewModel.props.selectorNamedSlot}</div>

      <div>{viewModel.props.namedSlot}</div>

      <div>{viewModel.props.children}</div>
    </div>
  );
}

export type SlotsWidgetPropsType = {
  namedSlot?: React.ReactNode;
  selectorNamedSlot?: React.ReactNode;
  children?: React.ReactNode;
};
const SlotsWidgetProps: SlotsWidgetPropsType = {};
import * as React from 'react';
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface SlotsWidget {
  props: typeof SlotsWidgetProps & RestProps;
  restAttributes: RestProps;
}

export default function SlotsWidget(
  props: typeof SlotsWidgetProps & RestProps
) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { children, namedSlot, selectorNamedSlot, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}

SlotsWidget.defaultProps = SlotsWidgetProps;
