import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
function view(viewModel: SlotsWidget) {
  return (
    <div>
      <div>{viewModel.props.selectorNamedSlot}</div>

      <div>{viewModel.props.namedSlot}</div>

      <div>{viewModel.props.children}</div>
    </div>
  );
}

interface SlotsWidgetPropsType {
  namedSlot?: React.ReactNode;
  selectorNamedSlot?: React.ReactNode;
  children?: React.ReactNode;
}

const SlotsWidgetProps = {} as Partial<SlotsWidgetPropsType>;
import * as React from 'react';
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type SlotsWidgetPropsModel = Required<
  Omit<
    GetPropsType<typeof SlotsWidgetProps>,
    'namedSlot' | 'selectorNamedSlot' | 'children'
  >
> &
  Partial<
    Pick<
      GetPropsType<typeof SlotsWidgetProps>,
      'namedSlot' | 'selectorNamedSlot' | 'children'
    >
  >;
interface SlotsWidget {
  props: SlotsWidgetPropsModel & RestProps;
  restAttributes: RestProps;
}
export default function SlotsWidget(
  inProps: typeof SlotsWidgetProps & RestProps
) {
  const props = combineWithDefaultProps<SlotsWidgetPropsModel>(
    SlotsWidgetProps,
    inProps
  );

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { children, namedSlot, selectorNamedSlot, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}
