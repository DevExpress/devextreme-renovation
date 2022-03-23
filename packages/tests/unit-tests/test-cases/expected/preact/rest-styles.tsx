const modifyStyles = (styles: any) => {
  return { height: '100px', ...styles };
};
function view({ styles }: Widget) {
  return <span style={normalizeStyles(styles)}></span>;
}

export type WidgetInputType = {};
const WidgetInput: WidgetInputType = {};
import { useCallback } from 'preact/hooks';
import { normalizeStyles } from '@devextreme/runtime/common';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetInput & RestProps;
  styles: any;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );
  const __styles = useCallback(
    function __styles(): any {
      const { style } = __restAttributes();
      return modifyStyles(style);
    },
    [__restAttributes]
  );

  return view({
    props: { ...props },
    styles: __styles(),
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = WidgetInput;
