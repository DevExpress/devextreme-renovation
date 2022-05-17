function view({ buttonRef, contentRef }: EffectSubscribeUnsubscribe) {
  return (
    <div>
      <span
        ref={buttonRef}
        style={normalizeStyles({ border: '1px solid black' })}
        id="effect-subscribe-unsubscribe-button"
      >
        Update State
      </span>
      :
      <span
        ref={contentRef}
        id="effect-subscribe-unsubscribe-button-content"
      ></span>
    </div>
  );
}

export type PropsType = {};
const Props: PropsType = {};
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  InfernoWrapperComponent,
} from '@devextreme/runtime/inferno-hooks';
import { normalizeStyles } from '@devextreme/runtime/inferno';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface EffectSubscribeUnsubscribe {
  props: typeof Props & RestProps;
  buttonRef: any;
  contentRef: any;
  state1: number;
  onButtonClick: () => any;
  restAttributes: RestProps;
}

function ReactEffectSubscribeUnsubscribe(props: typeof Props & RestProps) {
  const __buttonRef: MutableRefObject<HTMLSpanElement | null> =
    useRef<HTMLSpanElement>(null);
  const __contentRef: MutableRefObject<HTMLSpanElement | null> =
    useRef<HTMLSpanElement>(null);
  const [__state_state1, __state_setState1] = useState<number>(0);

  const __onButtonClick = useCallback(
    function __onButtonClick(): any {
      const value = __state_state1;
      if (__contentRef.current) {
        __contentRef.current.innerHTML = value.toString();
      }
      __state_setState1((__state_state1) => __state_state1 + 1);
    },
    [__state_state1]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );
  useEffect(() => {
    const handler = __onButtonClick.bind(this);
    __buttonRef.current?.addEventListener('click', handler);
    return () => __buttonRef.current?.removeEventListener('click', handler);
  }, [__onButtonClick]);

  return view({
    props: { ...props },
    state1: __state_state1,
    buttonRef: __buttonRef,
    contentRef: __contentRef,
    onButtonClick: __onButtonClick,
    restAttributes: __restAttributes(),
  });
}

HooksEffectSubscribeUnsubscribe.defaultProps = Props;

function HooksEffectSubscribeUnsubscribe(props: typeof Props & RestProps) {
  return (
    <InfernoWrapperComponent
      renderFn={ReactEffectSubscribeUnsubscribe}
      renderProps={props}
    />
  );
}
export { HooksEffectSubscribeUnsubscribe as EffectSubscribeUnsubscribe };
export default HooksEffectSubscribeUnsubscribe;
