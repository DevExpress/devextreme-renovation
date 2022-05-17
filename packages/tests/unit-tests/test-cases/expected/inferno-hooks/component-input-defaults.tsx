import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
function view(model: Widget) {
  return <div></div>;
}
function isMaterial() {
  return true;
}
function format(key: string) {
  return 'localized_' + key;
}

interface BasePropsType {
  empty?: string;
  height?: number;
  width?: number;
  baseNested?: typeof TextsProps | string;
  __defaultNestedValues?: any;
  children?: React.ReactNode;
}
export const BaseProps = {
  height: 10,
  get width() {
    return isMaterial() ? 20 : 10;
  },
  __defaultNestedValues: Object.freeze({ baseNested: { text: '3' } }) as any,
} as Partial<BasePropsType>;
interface TextsPropsType {
  text?: string;
}
export const TextsProps = {
  get text() {
    return format('text');
  },
} as Partial<TextsPropsType>;
interface ExpressionPropsType {
  expressionDefault?: any;
}
export const ExpressionProps = {
  get expressionDefault() {
    return isMaterial() ? 20 : 10;
  },
} as Partial<ExpressionPropsType>;
interface WidgetPropsType extends GetPropsType<typeof BaseProps> {
  text?: string;
  texts1?: typeof TextsProps;
  texts2?: typeof TextsProps;
  texts3?: typeof TextsProps;
  template?: React.FunctionComponent<GetPropsType<void>>;
  __defaultNestedValues?: any;
  render?: React.FunctionComponent<GetPropsType<void>>;
  component?: React.JSXElementConstructor<GetPropsType<void>>;
}
export const WidgetProps = Object.create(
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
) as Partial<WidgetPropsType>;
interface WidgetPropsTypeType {
  text?: string;
  texts1?: typeof TextsProps;
  texts2?: typeof TextsProps;
  texts3?: typeof TextsProps;
  template?: React.FunctionComponent<GetPropsType<void>>;
  empty?: string;
  height?: number;
  width?: number;
  baseNested?: typeof TextsProps | string;
  children?: React.ReactNode;
  expressionDefault?: any;
  __defaultNestedValues?: any;
  render?: React.FunctionComponent<GetPropsType<void>>;
  component?: React.JSXElementConstructor<GetPropsType<void>>;
}

const WidgetPropsType = {
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
} as Partial<WidgetPropsTypeType>;
import { __collectChildren, equalByValue } from '@devextreme/runtime/react';
import {
  useCallback,
  useMemo,
  useRef,
  HookComponent,
} from '@devextreme/runtime/inferno-hooks';
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
};
type WidgetPropsTypeModel = Required<
  Omit<
    GetPropsType<typeof WidgetPropsType>,
    'empty' | 'children' | 'render' | 'component'
  >
> &
  Partial<
    Pick<
      GetPropsType<typeof WidgetPropsType>,
      'empty' | 'children' | 'render' | 'component'
    >
  >;
interface Widget {
  props: WidgetPropsTypeModel & RestProps;
  __getNestedBaseNested: typeof TextsProps | string;
  __getNestedTexts3: typeof TextsProps;
  __getNestedTexts2: typeof TextsProps;
  restAttributes: RestProps;
}

export function Widget(inProps: typeof WidgetPropsType & RestProps) {
  const props = combineWithDefaultProps<WidgetPropsTypeModel>(
    WidgetPropsType,
    inProps
  );

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
      return restProps as RestProps;
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

function HooksWidget(props: typeof WidgetPropsType & RestProps) {
  return <HookComponent renderFn={Widget} renderProps={props}></HookComponent>;
}
export default HooksWidget;
