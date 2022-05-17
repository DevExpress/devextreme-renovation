import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';

interface PropsType {
  contentTemplate?: React.FunctionComponent<GetPropsType<any>>;
  contentRender?: React.FunctionComponent<GetPropsType<any>>;
  contentComponent?: React.JSXElementConstructor<GetPropsType<any>>;
}
export const Props = {
  contentTemplate: () => <div />,
} as Partial<PropsType>;
export const viewFunction = ({ props }: TestComponent): any => {
  const { contentTemplate: AnotherTemplate } = props;
  return AnotherTemplate({});
};

import * as React from 'react';
import { useCallback } from 'react';
import { getTemplate } from '@devextreme/runtime/react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type PropsModel = Required<
  Omit<GetPropsType<typeof Props>, 'contentRender' | 'contentComponent'>
> &
  Partial<
    Pick<GetPropsType<typeof Props>, 'contentRender' | 'contentComponent'>
  >;
interface TestComponent {
  props: PropsModel & RestProps;
  restAttributes: RestProps;
}
export function TestComponent(inProps: typeof Props & RestProps) {
  const props = combineWithDefaultProps<PropsModel>(Props, inProps);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { contentComponent, contentRender, contentTemplate, ...restProps } =
        props;
      return restProps as RestProps;
    },
    [props]
  );

  return viewFunction({
    props: {
      ...props,
      contentTemplate: getTemplate(
        props.contentTemplate,
        props.contentRender,
        props.contentComponent
      ),
    },
    restAttributes: __restAttributes(),
  });
}

export default TestComponent;
