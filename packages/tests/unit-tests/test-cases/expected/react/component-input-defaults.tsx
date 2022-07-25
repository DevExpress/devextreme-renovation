function view(model: Widget) {
  return <div></div>;
}
function isMaterial() {
  return true;
}
function format(key: string) {
  return 'localized_' + key;
}

export type BasePropsType = {
  empty?: string;
  height?: number;
  width?: number;
  baseNested?: typeof TextsProps | string;
  __defaultNestedValues?: any;
  children?: React.ReactNode;
};
export const BaseProps: BasePropsType = {
  height: 10,
  get width() {
    return isMaterial() ? 20 : 10;
  },
  __defaultNestedValues: Object.freeze({ baseNested: { text: '3' } }) as any,
};
export type TextsPropsType = {
  text?: string;
};
export const TextsProps: TextsPropsType = {
  get text() {
    return format('text');
  },
};
export type ExpressionPropsType = {
  expressionDefault?: any;
};
export const ExpressionProps: ExpressionPropsType = {
  get expressionDefault() {
    return isMaterial() ? 20 : 10;
  },
};
export type WidgetPropsType = typeof BaseProps & {
  text?: string;
  texts1?: typeof TextsProps;
  texts2?: typeof TextsProps;
  texts3?: typeof TextsProps;
  template?: React.FunctionComponent<Partial<void>>;
  __defaultNestedValues?: any;
  render?: React.FunctionComponent<Partial<void>>;
  component?: React.JSXElementConstructor<Partial<void>>;
};
export const WidgetProps: WidgetPropsType = Object.create(
  Object.prototype,
  Object.assign(
    Object.getOwnPropertyDescriptors(BaseProps),
    Object.getOwnPropertyDescriptors({
      get text() {
        return format('text');
      },
      texts1: Object.freeze({ text: format('text') }) as any,
      template: () => <div></div>,
      __defaultNestedValues: Object.freeze({
        texts2: { text: format('text') },
        texts3: TextsProps,
        baseNested: BaseProps?.__defaultNestedValues.baseNested,
      }) as any,
    })
  )
);
export type WidgetPropsTypeType = {
  text?: string;
  texts1?: typeof TextsProps;
  texts2?: typeof TextsProps;
  texts3?: typeof TextsProps;
  template?: React.FunctionComponent<Partial<void>>;
  empty?: string;
  height?: number;
  width?: number;
  baseNested?: typeof TextsProps | string;
  children?: React.ReactNode;
  expressionDefault?: any;
  __defaultNestedValues?: any;
  render?: React.FunctionComponent<Partial<void>>;
  component?: React.JSXElementConstructor<Partial<void>>;
};
const WidgetPropsType: WidgetPropsTypeType = {
  text: WidgetProps.text,
  texts1: WidgetProps.texts1,
  template: WidgetProps.template,
  height: WidgetProps.height,
  width: WidgetProps.width,
  expressionDefault: ExpressionProps.expressionDefault,
  __defaultNestedValues: Object.freeze({
    texts2: WidgetProps.texts2,
    texts3: WidgetProps.texts3,
    baseNested: WidgetProps.baseNested,
  }) as any,
};
import { __collectChildren, equalByValue } from '@devextreme/runtime/react';
import * as React from 'react';
import { useCallback, useMemo, useRef } from 'react';
import { getTemplate } from '@devextreme/runtime/react';

export const Texts2: React.FunctionComponent<typeof TextsProps> & {
  propName: string;
} = () => null;
Texts2.propName = 'texts2';
Texts2.defaultProps = TextsProps;

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface Widget {
  props: typeof WidgetPropsType & RestProps;
  __getNestedBaseNested: typeof TextsProps | string;
  __getNestedTexts3: typeof TextsProps;
  __getNestedTexts2: typeof TextsProps;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetPropsType & RestProps) {
  const cachedNested = useRef<any>(__collectChildren(props.children));

  const __getNestedBaseNested = useMemo(
    function __getNestedBaseNested(): typeof TextsProps | string {
      const nested = __collectChildren(props.children);
      if (!equalByValue(cachedNested.current, nested))
        cachedNested.current = nested;
      return props.baseNested
        ? props.baseNested
        : cachedNested.current.baseNested
        ? cachedNested.current.baseNested?.[0]
        : props?.__defaultNestedValues?.baseNested;
    },
    [props.baseNested, props.children]
  );
  const __getNestedTexts3 = useMemo(
    function __getNestedTexts3(): typeof TextsProps {
      const nested = __collectChildren(props.children);
      if (!equalByValue(cachedNested.current, nested))
        cachedNested.current = nested;
      return props.texts3
        ? props.texts3
        : cachedNested.current.texts3
        ? cachedNested.current.texts3?.[0]
        : props?.__defaultNestedValues?.texts3;
    },
    [props.texts3, props.children]
  );
  const __getNestedTexts2 = useMemo(
    function __getNestedTexts2(): typeof TextsProps {
      const nested = __collectChildren(props.children);
      if (!equalByValue(cachedNested.current, nested))
        cachedNested.current = nested;
      return props.texts2
        ? props.texts2
        : cachedNested.current.texts2
        ? cachedNested.current.texts2?.[0]
        : props?.__defaultNestedValues?.texts2;
    },
    [props.texts2, props.children]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        __defaultNestedValues,
        baseNested,
        children,
        component,
        empty,
        expressionDefault,
        height,
        render,
        template,
        text,
        texts1,
        texts2,
        texts3,
        width,
        ...restProps
      } = {
        ...props,
        texts2: __getNestedTexts2,
        texts3: __getNestedTexts3,
        baseNested: __getNestedBaseNested,
      };
      return restProps;
    },
    [props]
  );

  return view({
    props: {
      ...props,
      template: getTemplate(props.template, props.render, props.component),
      texts2: __getNestedTexts2,
      texts3: __getNestedTexts3,
      baseNested: __getNestedBaseNested,
    },
    __getNestedBaseNested,
    __getNestedTexts3,
    __getNestedTexts2,
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = WidgetPropsType;
