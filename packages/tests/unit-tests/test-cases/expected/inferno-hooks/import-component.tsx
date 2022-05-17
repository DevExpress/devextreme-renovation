import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import Base, { WidgetProps } from './component-input';
function view(model: Child) {
  return <Base height={model.getProps().height} />;
}

interface ChildInputType extends GetPropsType<typeof WidgetProps> {
  height?: number;
  onClick?: (a: number) => void;
}

const ChildInput = Object.create(
  Object.prototype,
  Object.assign(
    Object.getOwnPropertyDescriptors(WidgetProps),
    Object.getOwnPropertyDescriptors({
      height: 10,
      onClick: () => {},
    })
  )
) as Partial<ChildInputType>;
import { useCallback, HookComponent } from '@devextreme/runtime/inferno-hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type ChildInputModel = Required<
  Omit<GetPropsType<typeof ChildInput>, 'children'>
> &
  Partial<Pick<GetPropsType<typeof ChildInput>, 'children'>>;
interface Child {
  props: ChildInputModel & RestProps;
  getProps: () => typeof WidgetProps;
  restAttributes: RestProps;
}

export function Child(inProps: typeof ChildInput & RestProps) {
  const props = combineWithDefaultProps<ChildInputModel>(ChildInput, inProps);

  const __getProps = useCallback(
    function __getProps(): typeof WidgetProps {
      return { height: props.height } as typeof WidgetProps;
    },
    [props.height]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { children, height, onClick, width, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    getProps: __getProps,
    restAttributes: __restAttributes(),
  });
}

function HooksChild(props: typeof ChildInput & RestProps) {
  return <HookComponent renderFn={Child} renderProps={props}></HookComponent>;
}
export default HooksChild;
