import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
function view(model: Widget): any {
  const sizes = model.props.sizes ?? { width: 0, height: 0 };
  return (
    <span>
      {sizes.height}

      {sizes.width}
    </span>
  );
}
type EventCallBack<Type> = (e: Type) => void;
const device = 'ios';
function isDevice() {
  return true;
}

interface WidgetInputType {
  height?: number;
  export?: object;
  array?: any;
  currentDate?: any;
  expressionDefault?: string;
  expressionDefault1?: boolean;
  expressionDefault2?: boolean | string;
  sizes?: { height: number; width: number };
  stringValue?: string;
  onClick?: (a: number) => void;
  onSomething?: EventCallBack<number>;
  defaultStringValue?: string;
  stringValueChange?: (stringValue: string) => void;
}
export const WidgetInput = {
  height: 10,
  export: Object.freeze({}) as any,
  array: Object.freeze(['1']) as any,
  currentDate: Object.freeze(new Date()) as any,
  get expressionDefault() {
    return device === 'ios' ? 'yes' : 'no';
  },
  get expressionDefault1() {
    return !device;
  },
  get expressionDefault2() {
    return isDevice() || 'test';
  },
  onClick: () => {},
  onSomething: () => {},
  defaultStringValue: '',
  stringValueChange: () => {},
} as Partial<WidgetInputType>;
import { useState, useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type WidgetInputModel = Required<
  Omit<GetPropsType<typeof WidgetInput>, 'sizes'>
> &
  Partial<Pick<GetPropsType<typeof WidgetInput>, 'sizes'>>;
interface Widget {
  props: WidgetInputModel & RestProps;
  getHeight: () => number;
  getRestProps: () => { export: object; onSomething: EventCallBack<number> };
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof WidgetInput & RestProps) {
  const props = combineWithDefaultProps<WidgetInputModel>(WidgetInput, inProps);

  const [__state_stringValue, __state_setStringValue] = useState<string>(() =>
    props.stringValue !== undefined
      ? props.stringValue
      : props.defaultStringValue!
  );

  const __getHeight = useCallback(
    function __getHeight(): number {
      props.onClick(10);
      const { onClick } = props;
      onClick(11);
      return props.height;
    },
    [props.onClick, props.height]
  );
  const __getRestProps = useCallback(
    function __getRestProps(): {
      export: object;
      onSomething: EventCallBack<number>;
    } {
      const { height, onClick, ...rest } = {
        ...props,
        stringValue:
          props.stringValue !== undefined
            ? props.stringValue
            : __state_stringValue,
      };
      return rest;
    },
    [props, __state_stringValue]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        array,
        currentDate,
        defaultStringValue,
        export: exportProp,
        expressionDefault,
        expressionDefault1,
        expressionDefault2,
        height,
        onClick,
        onSomething,
        sizes,
        stringValue,
        stringValueChange,
        ...restProps
      } = {
        ...props,
        stringValue:
          props.stringValue !== undefined
            ? props.stringValue
            : __state_stringValue,
      };
      return restProps as RestProps;
    },
    [props, __state_stringValue]
  );

  return view({
    props: {
      ...props,
      stringValue:
        props.stringValue !== undefined
          ? props.stringValue
          : __state_stringValue,
    },
    getHeight: __getHeight,
    getRestProps: __getRestProps,
    restAttributes: __restAttributes(),
  });
}
