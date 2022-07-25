export type SomePropsType = {};
const SomeProps: SomePropsType = {};
function view() {
  return <span></span>;
}

import {
  useState,
  useCallback,
  useEffect,
  HookContainer,
} from '@devextreme/runtime/inferno-hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface InheritedFromInfernoComponent {
  props: typeof SomeProps & RestProps;
  _hovered: Boolean;
  someGetter: any;
  restAttributes: RestProps;
}

function ReactInheritedFromInfernoComponent(
  props: typeof SomeProps & RestProps
) {
  const [__state__hovered, __state_set_hovered] = useState<Boolean>(false);

  const __someGetter = useCallback(
    function __someGetter(): any {
      return __state__hovered;
    },
    [__state__hovered]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );
  useEffect(() => {}, []);

  return view();
}

HooksInheritedFromInfernoComponent.defaultProps = SomeProps;

function HooksInheritedFromInfernoComponent(
  props: typeof SomeProps & RestProps
) {
  return (
    <HookContainer
      renderFn={ReactInheritedFromInfernoComponent}
      renderProps={props}
    />
  );
}
export { HooksInheritedFromInfernoComponent as InheritedFromInfernoComponent };
export default HooksInheritedFromInfernoComponent;
