import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import InnerWidget from './dependency-props';
import WidgetWithTemplate from './dx-widget-with-template';
const CustomTemplate = ({ text }: { text: string; value: number }) => {
  return <span>{text}</span>;
};
function view(model: Widget) {
  return (
    <React.Fragment>
      <WidgetWithTemplate
        template={CustomTemplate}
        componentTemplate={InnerWidget}
        arrowTemplate={(data: { name: string; id: number }) => (
          <div>{data.name}</div>
        )}
      />

      <WidgetWithTemplate
        arrowTemplate={(data: { name: string; id: number }) => (
          <div>{data.id}</div>
        )}
      />
    </React.Fragment>
  );
}

interface WidgetPropsType {}
export const WidgetProps = {} as Partial<WidgetPropsType>;
import * as React from 'react';
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

interface Widget {
  props: Required<GetPropsType<typeof WidgetProps>> & RestProps;
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof WidgetProps & RestProps) {
  const props = combineWithDefaultProps<
    Required<GetPropsType<typeof WidgetProps>>
  >(WidgetProps, inProps);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}
