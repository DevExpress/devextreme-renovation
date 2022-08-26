function view(viewModel: Widget) {
  return (
    <tr>
      {viewModel.cells.map((height) => (
        <td style={normalizeStyles({ height })} />
      ))}
    </tr>
  );
}

export type WidgetInputType = {};
const WidgetInput: WidgetInputType = {};
import { useCallback, useMemo } from 'react';
import { normalizeStyles } from '@devextreme/runtime/common';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface Widget {
  props: typeof WidgetInput & RestProps;
  cells: string[];
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const __cells = useMemo(function __cells(): string[] {
    return [];
  }, []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    cells: __cells,
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = WidgetInput;
