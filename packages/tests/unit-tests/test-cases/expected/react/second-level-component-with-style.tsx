import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
function view(viewModel: Widget) {
  return (
    <tr>
      {viewModel.cells.map((height) => (
        <td style={normalizeStyles({ height })} />
      ))}
    </tr>
  );
}

interface WidgetInputType {}

const WidgetInput = {} as Partial<WidgetInputType>;
import { useCallback, useMemo } from 'react';
import { normalizeStyles } from '@devextreme/runtime/common';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

interface Widget {
  props: Required<GetPropsType<typeof WidgetInput>> & RestProps;
  cells: string[];
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof WidgetInput & RestProps) {
  const props = combineWithDefaultProps<
    Required<GetPropsType<typeof WidgetInput>>
  >(WidgetInput, inProps);

  const __cells = useMemo(function __cells(): string[] {
    return [];
  }, []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    cells: __cells,
    restAttributes: __restAttributes(),
  });
}
