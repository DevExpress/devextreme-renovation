import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
export type EnumType = 'data' | 'none';
export type Union = string | number;
export type ObjType = { number: number; text: string };
export type StringArr = Array<String>;
export type StringType = String;
export type StrDate = string | Date;
export const viewFunction = (viewModel: Widget) => {
  return <div></div>;
};

interface WidgetPropsType {
  data?: EnumType;
  union?: Union;
  obj?: ObjType;
  strArr?: StringArr;
  s?: StringType;
  strDate?: StrDate;
  customTypeField?: { name: string; customField: CustomType }[];
}
export const WidgetProps = {
  data: 'data',
  union: 'uniontext',
  obj: Object.freeze({ number: 123, text: 'sda' }) as any,
  strArr: Object.freeze(['ba', 'ab']) as any,
  s: '',
  strDate: Object.freeze(new Date()) as any,
} as Partial<WidgetPropsType>;
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type WidgetPropsModel = Required<
  Omit<GetPropsType<typeof WidgetProps>, 'customTypeField'>
> &
  Partial<Pick<GetPropsType<typeof WidgetProps>, 'customTypeField'>>;
interface Widget {
  props: WidgetPropsModel & RestProps;
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof WidgetProps & RestProps) {
  const props = combineWithDefaultProps<WidgetPropsModel>(WidgetProps, inProps);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        customTypeField,
        data,
        obj,
        s,
        strArr,
        strDate,
        union,
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

export interface CustomType {
  name: string;
  value: number;
}
