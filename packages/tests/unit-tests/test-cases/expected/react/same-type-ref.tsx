import { MutableRefObject } from 'react';
import BaseWidget from './method';
function view(viewModel: Widget) {
  return <BaseWidget></BaseWidget>;
}

export type WidgetInputType = {
  nullableRef?: MutableRefObject<HTMLDivElement | null>;
};
const WidgetInput: WidgetInputType = {};
import { WidgetRef as BaseWidgetRef } from './method';
import { useCallback, useRef } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface Widget {
  props: typeof WidgetInput & RestProps;
  divRef1: any;
  divRef2: any;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const __divRef1: MutableRefObject<BaseWidgetRef | null> =
    useRef<BaseWidgetRef>(null);
  const __divRef2: MutableRefObject<BaseWidgetRef | null> =
    useRef<BaseWidgetRef>(null);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { nullableRef, ...restProps } = props;
      return restProps;
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

Widget.defaultProps = WidgetInput;
