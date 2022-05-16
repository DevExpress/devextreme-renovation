import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
const modifyStyles = (styles: any) => {
  return { height: '100px', ...styles };
};
function view({ styles }: Widget) {
  return <span style={normalizeStyles(styles)}></span>;
}

interface WidgetInputType {}

const WidgetInput = {} as Partial<WidgetInputType>;
import { useCallback } from 'react';
import { normalizeStyles } from '@devextreme/runtime/common';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

interface Widget {
  props: Required<GetPropsType<typeof WidgetInput>> & RestProps;
  styles: any;
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof WidgetInput & RestProps) {
  const props = combineWithDefaultProps<
    Required<GetPropsType<typeof WidgetInput>>
  >(WidgetInput, inProps);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps as RestProps;
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
