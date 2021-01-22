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
import { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<HTMLAttributes<HTMLElement>, keyof typeof Props>;
interface TestComponent {
  props: typeof Props & RestProps;
  restAttributes: RestProps;
}

const getTemplate = (TemplateProp: any, RenderProp: any, ComponentProp: any) =>
  (TemplateProp &&
    (TemplateProp.defaultProps
      ? (props: any) => <TemplateProp {...props} />
      : TemplateProp)) ||
  (RenderProp &&
    ((props: any) =>
      RenderProp(
        ...("data" in props ? [props.data, props.index] : [props])
      ))) ||
  (ComponentProp && ((props: any) => <ComponentProp {...props} />));

export function TestComponent(props: typeof Props & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        contentComponent,
        contentRender,
        contentTemplate,
        ...restProps
      } = props;
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

TestComponent.defaultProps = {
  ...Props,
};
