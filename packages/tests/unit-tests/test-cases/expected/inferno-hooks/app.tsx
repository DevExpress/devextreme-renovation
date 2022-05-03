function view(model: RefProps) {
  return <div>{'Ref Props'}</div>;
}

export type PropsType = {
  parentRef: MutableRefObject<HTMLDivElement | null>;
};
const Props: PropsType = {} as any as PropsType;
import {
  useCallback,
  useEffect,
  InfernoWrapperComponent,
} from '@devextreme/runtime/inferno-hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface RefProps {
  props: typeof Props & RestProps;
  restAttributes: RestProps;
}

function ReactRefProps(props: typeof Props & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { parentRef, ...restProps } = props;
      return restProps;
    },
    [props]
  );
  useEffect(() => {
    const parentRef = props.parentRef;
    if (parentRef.current) {
      parentRef.current.style.backgroundColor = '#aaaaff';
      parentRef.current.innerHTML += 'childText';
    }
  }, []);

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}

HooksRefProps.defaultProps = Props;

function HooksRefProps(props: typeof Props & RestProps) {
  return (
    <InfernoWrapperComponent renderFn={ReactRefProps} renderProps={props} />
  );
}
export { HooksRefProps as RefProps };
export default HooksRefProps;
