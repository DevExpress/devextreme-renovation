function view(model: ComponentWithRest) {
  return <div {...model.restAttributes}></div>;
}

export type WidgetInputType = {
  id?: string;
  export?: {};
};
const WidgetInput: WidgetInputType = {};
import * as React from 'react';
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface ComponentWithRest {
  props: typeof WidgetInput & RestProps;
  restAttributes: RestProps;
}

export default function ComponentWithRest(
  props: typeof WidgetInput & RestProps
) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { export: exportProp, id, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}

ComponentWithRest.defaultProps = WidgetInput;
