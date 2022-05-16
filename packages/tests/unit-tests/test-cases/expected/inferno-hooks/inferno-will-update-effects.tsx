import { GetPropsType } from '@devextreme/runtime/react';

interface SomePropsType {}

const SomeProps = {} as Partial<SomePropsType>;
function view() {
  return <span></span>;
}

import {
  useState,
  useCallback,
  useEffect,
  HookComponent,
} from '@devextreme/runtime/inferno-hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface InheritedFromInfernoComponent {
  props: Required<GetPropsType<typeof SomeProps>> & RestProps;
  _hovered: Boolean;
  someGetter: any;
  restAttributes: RestProps;
}

export function InheritedFromInfernoComponent(
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
      return restProps as RestProps;
    },
    [props]
  );
  useEffect(() => {}, []);

  return view();
}

function HooksInheritedFromInfernoComponent(
  props: typeof SomeProps & RestProps
) {
  return (
    <HookComponent
      renderFn={InheritedFromInfernoComponent}
      renderProps={props}
    ></HookComponent>
  );
}
export default HooksInheritedFromInfernoComponent;
