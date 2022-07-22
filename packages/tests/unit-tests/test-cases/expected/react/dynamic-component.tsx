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

export type PropsType = {
  height: number;
};
const Props: PropsType = {
  height: 10,
};
import * as React from 'react';
import { useState, useCallback } from 'react';
import { normalizeStyles } from '@devextreme/runtime/common';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface DynamicComponentCreator {
  props: typeof Props & RestProps;
  internalStateValue: number;
  Component: typeof DynamicComponent;
  JSXTemplateComponent: React.FunctionComponent<Partial<typeof WidgetInput>>;
  ComponentWithTemplate: React.FunctionComponent<
    Partial<typeof PropsWithTemplate>
  >;
  spreadProps: any;
  onComponentClick: () => any;
  restAttributes: RestProps;
}

export default function DynamicComponentCreator(
  props: typeof Props & RestProps
) {
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
      Partial<typeof WidgetInput>
    > {
      return DynamicComponent as React.FunctionComponent<
        Partial<typeof WidgetInput>
      >;
    },
    []
  );
  const __ComponentWithTemplate = useCallback(
    function __ComponentWithTemplate(): React.FunctionComponent<
      Partial<typeof PropsWithTemplate>
    > {
      return DynamicComponentWithTemplate as React.FunctionComponent<
        Partial<typeof PropsWithTemplate>
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
      return restProps;
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

DynamicComponentCreator.defaultProps = Props;
