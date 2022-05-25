import { Portal as createPortal } from '@devextreme/runtime/inferno-hooks';
function view(model: Widget) {
  return (
    <div>
      {model.rendered ? (
        <Portal container={document.body}>
          <span></span>
        </Portal>
      ) : null}

      <Portal container={model.props.someRef?.current}>
        <span></span>
      </Portal>
    </div>
  );
}

export type WidgetPropsType = {
  someRef?: MutableRefObject<HTMLElement | null>;
};
export const WidgetProps: WidgetPropsType = {};
import {
  useState,
  useCallback,
  useEffect,
  HookContainer,
} from '@devextreme/runtime/inferno-hooks';

type PortalProps = {
  container?: HTMLElement | null;
  children: React.ReactNode;
};
const Portal = ({
  container,
  children,
}: PortalProps): React.ReactPortal | null => {
  if (container) {
    return createPortal({ container, children });
  }
  return null;
};

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetProps & RestProps;
  rendered: boolean;
  restAttributes: RestProps;
}

function ReactWidget(props: typeof WidgetProps & RestProps) {
  const [__state_rendered, __state_setRendered] = useState<boolean>(false);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { someRef, ...restProps } = props;
      return restProps;
    },
    [props]
  );
  useEffect(() => {
    __state_setRendered((__state_rendered) => true);
  }, []);

  return view({
    props: { ...props },
    rendered: __state_rendered,
    restAttributes: __restAttributes(),
  });
}

HooksWidget.defaultProps = WidgetProps;

function HooksWidget(props: typeof WidgetProps & RestProps) {
  return <HookContainer renderFn={ReactWidget} renderProps={props} />;
}
export { HooksWidget as Widget };
export default HooksWidget;
