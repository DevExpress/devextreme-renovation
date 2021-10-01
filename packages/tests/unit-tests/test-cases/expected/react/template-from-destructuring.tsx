export declare type PropsType = {
  contentTemplate: React.FunctionComponent<Partial<any>>;
  contentRender?: React.FunctionComponent<Partial<any>>;
  contentComponent?: React.JSXElementConstructor<Partial<any>>;
};
export const Props: PropsType = {
  contentTemplate: () => <div />,
};
export const viewFunction = ({ props }: TestComponent): any => {
  const { contentTemplate: AnotherTemplate } = props;
  return AnotherTemplate({});
};

import * as React from "react";
import { useCallback } from "react";
import { getTemplate } from "@devextreme/runtime/react";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface TestComponent {
  props: typeof Props & RestProps;
  restAttributes: RestProps;
}
export function TestComponent(props: typeof Props & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { contentComponent, contentRender, contentTemplate, ...restProps } =
        props;
      return restProps;
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

TestComponent.defaultProps = Props;
