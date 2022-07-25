export type SomePropsType = {};
const SomeProps: SomePropsType = {};
function view() {
  return <span></span>;
}

import {
  useState,
  useCallback,
  HookContainer,
} from '@devextreme/runtime/inferno-hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface InheritedFromBaseComponent {
  props: typeof SomeProps & RestProps;
  _hovered: Boolean;
  updateState: () => any;
  restAttributes: RestProps;
}

function ReactInheritedFromBaseComponent(props: typeof SomeProps & RestProps) {
  const [__state__hovered, __state_set_hovered] = useState<Boolean>(false);

  const __updateState = useCallback(
    function __updateState(): any {
      __state_set_hovered((__state__hovered) => !__state__hovered);
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

  return view();
}

HooksInheritedFromBaseComponent.defaultProps = SomeProps;

function HooksInheritedFromBaseComponent(props: typeof SomeProps & RestProps) {
  return (
    <HookContainer
      renderFn={ReactInheritedFromBaseComponent}
      renderProps={props}
    />
  );
}
export { HooksInheritedFromBaseComponent as InheritedFromBaseComponent };
export default HooksInheritedFromBaseComponent;
