import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import DynamicComponent, { WidgetInput } from './props';
import DynamicComponentWithTemplate, {
  WidgetInput as PropsWithTemplate,
} from './template';
function view({
  Component,
  ComponentWithTemplate,
  JSXTemplateComponent,
  internalStateValue,
  onComponentClick,
  props: { height },
  spreadProps,
}: DynamicComponentCreator): any {
  return (
    <div>
      <JSXTemplateComponent
        height={internalStateValue}
        onClick={onComponentClick}
        {...spreadProps}
      />

      <Component height={height} onClick={onComponentClick} />

      <ComponentWithTemplate
        template={({ textProp }) => (
          <div style={normalizeStyles({ height: '50px' })}>{textProp}</div>
        )}
      />
    </div>
  );
}

interface PropsType {
  height?: number;
}

const Props = {
  height: 10,
} as Partial<PropsType>;
import * as React from 'react';
import { useState, useCallback } from 'react';
import { normalizeStyles } from '@devextreme/runtime/common';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

interface DynamicComponentCreator {
  props: Required<GetPropsType<typeof Props>> & RestProps;
  internalStateValue: number;
  Component: typeof DynamicComponent;
  JSXTemplateComponent: React.FunctionComponent<
    GetPropsType<typeof WidgetInput>
  >;
  ComponentWithTemplate: React.FunctionComponent<
    GetPropsType<typeof PropsWithTemplate>
  >;
  spreadProps: any;
  onComponentClick: () => any;
  restAttributes: RestProps;
}
export default function DynamicComponentCreator(
  inProps: typeof Props & RestProps
) {
  const props = combineWithDefaultProps<Required<GetPropsType<typeof Props>>>(
    Props,
    inProps
  );

  const [__state_internalStateValue, __state_setInternalStateValue] =
    useState<number>(0);

  const __Component = useCallback(
    function __Component(): typeof DynamicComponent {
      return DynamicComponent;
    },
    []
  );
  const __JSXTemplateComponent = useCallback(
    function __JSXTemplateComponent(): React.FunctionComponent<
      GetPropsType<typeof WidgetInput>
    > {
      return DynamicComponent as React.FunctionComponent<
        GetPropsType<typeof WidgetInput>
      >;
    },
    []
  );
  const __ComponentWithTemplate = useCallback(
    function __ComponentWithTemplate(): React.FunctionComponent<
      GetPropsType<typeof PropsWithTemplate>
    > {
      return DynamicComponentWithTemplate as React.FunctionComponent<
        GetPropsType<typeof PropsWithTemplate>
      >;
    },
    []
  );
  const __spreadProps = useCallback(function __spreadProps(): any {
    return { export: {} };
  }, []);
  const __onComponentClick = useCallback(function __onComponentClick(): any {},
  []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { height, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    internalStateValue: __state_internalStateValue,
    Component: __Component(),
    JSXTemplateComponent: __JSXTemplateComponent(),
    ComponentWithTemplate: __ComponentWithTemplate(),
    spreadProps: __spreadProps(),
    onComponentClick: __onComponentClick,
    restAttributes: __restAttributes(),
  });
}
