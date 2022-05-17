import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import {
  EnumType,
  Union,
  ObjType,
  StringArr,
  StringType,
} from './types-external';
export const viewFunction = (viewModel: Widget) => {
  return <div></div>;
};

interface WidgetPropsType {
  str?: String;
  num?: Number;
  bool?: Boolean;
  arr?: Array<any>;
  strArr?: Array<String>;
  obj?: Object;
  date?: Date;
  func?: Function;
  symbol?: Symbol;
  externalEnum?: EnumType;
  externalUnion?: Union;
  externalObj?: ObjType;
  externalArray?: StringArr;
  externalString?: StringType;
}
export const WidgetProps = {
  str: '',
  num: 1,
  bool: true,
  arr: Object.freeze([]) as any,
  strArr: Object.freeze(['a', 'b']) as any,
  obj: Object.freeze({}) as any,
  date: Object.freeze(new Date()) as any,
  func: () => {},
  get symbol() {
    return Symbol('x');
  },
  externalEnum: 'data',
  externalUnion: 0,
  externalObj: Object.freeze({ number: 0, text: 'text' }) as any,
  externalArray: Object.freeze(['s1', 's2']) as any,
  externalString: 'someValue',
} as Partial<WidgetPropsType>;
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
      const {
        arr,
        bool,
        date,
        externalArray,
        externalEnum,
        externalObj,
        externalString,
        externalUnion,
        func,
        num,
        obj,
        str,
        strArr,
        symbol,
        ...restProps
      } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return viewFunction({
    props: { ...props },
    restAttributes: __restAttributes(),
  });
}

import { CustomType } from './types-external';

interface BaseViewPropsTypeType {
  strArr?: Array<String>;
  customTypeField?: { name: string; customField: CustomType }[];
}

const BaseViewPropsType = {
  strArr: WidgetProps.strArr,
} as Partial<BaseViewPropsTypeType>;
