import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import { Widget } from './export-named';
function view(model: Child) {
  return <Widget prop={true} />;
}

interface ChildInputType {
  height?: number;
}

const ChildInput = {
  height: 10,
} as Partial<ChildInputType>;
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

interface Child {
  props: Required<GetPropsType<typeof ChildInput>> & RestProps;
  restAttributes: RestProps;
}
export default function Child(inProps: typeof ChildInput & RestProps) {
  const props = combineWithDefaultProps<
    Required<GetPropsType<typeof ChildInput>>
  >(ChildInput, inProps);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { height, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}
