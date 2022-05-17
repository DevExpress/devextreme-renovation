import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import { MutableRefObject } from 'react';
import WidgetWithRefProp from './dx-widget-with-ref-prop';
function view(viewModel: Widget) {
  return (
    <div ref={viewModel.divRef}>
      <WidgetWithRefProp
        parentRef={viewModel.divRef}
        nullableRef={viewModel.props.nullableRef}
      />
    </div>
  );
}

interface WidgetInputType {
  nullableRef?: MutableRefObject<HTMLDivElement | null>;
}

const WidgetInput = {} as Partial<WidgetInputType>;
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
  divRef: any;
  getDirectly: () => any;
  getDestructed: () => any;
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof WidgetInput & RestProps) {
  const props = combineWithDefaultProps<WidgetInputModel>(WidgetInput, inProps);
  const __divRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);

  const __getDirectly = useCallback(
    function __getDirectly(): any {
      const divRefOuter = __divRef.current?.outerHTML ?? '';
      const nullableRefOuter = props.nullableRef?.current?.outerHTML ?? '';
      return divRefOuter + nullableRefOuter;
    },
    [props.nullableRef]
  );
  const __getDestructed = useCallback(
    function __getDestructed(): any {
      const { nullableRef } = props;
      const divRefOuter = __divRef.current?.outerHTML ?? '';
      const nullableRefOuter = nullableRef?.current?.outerHTML ?? '';
      return divRefOuter + nullableRefOuter;
    },
    [props.nullableRef]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { nullableRef, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    divRef: __divRef,
    getDirectly: __getDirectly,
    getDestructed: __getDestructed,
    restAttributes: __restAttributes(),
  });
}
