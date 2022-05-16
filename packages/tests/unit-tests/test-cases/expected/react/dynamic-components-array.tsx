import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import DynamicComponent, { WidgetInput } from './props';
function view({ Components, onComponentClick }: DynamicComponentCreator): any {
  return (
    <div>
      {Components.map((C, index) => (
        <C key={index} onClick={onComponentClick} />
      ))}
    </div>
  );
}

interface PropsType {
  height?: number;
}

const Props = {
  height: 10,
} as Partial<PropsType>;
import * as React from 'react';
import { useCallback, useMemo } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

interface DynamicComponentCreator {
  props: Required<GetPropsType<typeof Props>> & RestProps;
  Components: React.FunctionComponent<GetPropsType<typeof WidgetInput>>[];
  onComponentClick: () => any;
  restAttributes: RestProps;
}
export default function DynamicComponentCreator(
  inProps: typeof Props & RestProps
) {
  const props = combineWithDefaultProps<Required<GetPropsType<typeof Props>>>(
    Props,
    inProps
  );

  const __Components = useMemo(function __Components(): React.FunctionComponent<
    GetPropsType<typeof WidgetInput>
  >[] {
    return [DynamicComponent] as React.FunctionComponent<
      GetPropsType<typeof WidgetInput>
    >[];
  },
  []);
  const __onComponentClick = useCallback(function __onComponentClick(): any {},
  []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { height, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    Components: __Components,
    onComponentClick: __onComponentClick,
    restAttributes: __restAttributes(),
  });
}
