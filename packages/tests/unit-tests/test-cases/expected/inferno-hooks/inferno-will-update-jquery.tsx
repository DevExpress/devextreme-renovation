export type SomePropsType = {};
const SomeProps: SomePropsType = {};
function view() {
  return <span></span>;
}

import {
  useState,
  useCallback,
  InfernoWrapperComponent,
} from '@devextreme/runtime/inferno-hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface InheritedFromInfernoWrapperComponent {
  props: typeof SomeProps & RestProps;
  _hovered: Boolean;
  someGetter: any;
  restAttributes: RestProps;
}

function ReactInheritedFromInfernoWrapperComponent(
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

  return view();
}

HooksInheritedFromInfernoWrapperComponent.defaultProps = SomeProps;

function HooksInheritedFromInfernoWrapperComponent(
  props: typeof SomeProps & RestProps
) {
  return (
    <InfernoWrapperComponent
      renderFn={ReactInheritedFromInfernoWrapperComponent}
      renderProps={props}
    />
  );
}
export { HooksInheritedFromInfernoWrapperComponent as InheritedFromInfernoWrapperComponent };
export default HooksInheritedFromInfernoWrapperComponent;
