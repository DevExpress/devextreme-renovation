import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import { MutableRefObject } from 'react';
import BaseWidget from './method';
function view(viewModel: Widget) {
  return <BaseWidget></BaseWidget>;
}

interface WidgetInputType {
  nullableRef?: MutableRefObject<HTMLDivElement | null>;
}

const WidgetInput = {} as Partial<WidgetInputType>;
import { WidgetRef as BaseWidgetRef } from './method';
import { useCallback, useRef } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type WidgetInputModel = Required<
  Omit<GetPropsType<typeof WidgetInput>, 'nullableRef'>
> &
  Partial<Pick<GetPropsType<typeof WidgetInput>, 'nullableRef'>>;
interface Widget {
  props: WidgetInputModel & RestProps;
  divRef1: any;
  divRef2: any;
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof WidgetInput & RestProps) {
  const props = combineWithDefaultProps<WidgetInputModel>(WidgetInput, inProps);
  const __divRef1: MutableRefObject<BaseWidgetRef | null> =
    useRef<BaseWidgetRef>(null);
  const __divRef2: MutableRefObject<BaseWidgetRef | null> =
    useRef<BaseWidgetRef>(null);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { nullableRef, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    divRef1: __divRef1,
    divRef2: __divRef2,
    restAttributes: __restAttributes(),
  });
}
