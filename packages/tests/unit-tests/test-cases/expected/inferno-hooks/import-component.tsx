import Base, { WidgetProps } from './component-input';
function view(model: Child) {
  return <Base height={model.getProps().height} />;
}

export type ChildInputType = typeof WidgetProps & {
  height: number;
  onClick: (a: number) => void;
};
const ChildInput: ChildInputType = Object.create(
  Object.prototype,
  Object.assign(
    Object.getOwnPropertyDescriptors(WidgetProps),
    Object.getOwnPropertyDescriptors({
      height: 10,
      onClick: () => {},
    })
  )
);
import { useCallback, HookContainer } from '@devextreme/runtime/inferno-hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface Child {
  props: typeof ChildInput & RestProps;
  getProps: () => typeof WidgetProps;
  restAttributes: RestProps;
}

function ReactChild(props: typeof ChildInput & RestProps) {
  const __getProps = useCallback(
    function __getProps(): typeof WidgetProps {
      return { height: props.height } as typeof WidgetProps;
    },
    [props.height]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { children, height, onClick, width, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    getProps: __getProps,
    restAttributes: __restAttributes(),
  });
}

HooksChild.defaultProps = ChildInput;

function HooksChild(props: typeof ChildInput & RestProps) {
  return <HookContainer renderFn={ReactChild} renderProps={props} />;
}
export { HooksChild as Child };
export default HooksChild;
