import WidgetWithTemplate from './dx-widget-with-template';
import InnerWidget from './dx-inner-widget';
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

      <WidgetWithTemplate
        typedTemplate={({ array: [param1, param2], obj: { text } }) => (
          <div>
            {param1}

            {param2}

            {text}
          </div>
        )}
      />
    </React.Fragment>
  );
}

export type WidgetPropsType = {};
export const WidgetProps: WidgetPropsType = {};
import * as React from 'react';
import { useCallback } from 'react';

type RestProps = {
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

Widget.defaultProps = WidgetProps;
