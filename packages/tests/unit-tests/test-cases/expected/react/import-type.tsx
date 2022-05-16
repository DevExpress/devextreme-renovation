import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import type { Options } from './types.d';
export const viewFunction = (viewModel: Import) => {
  return <div>{viewModel.props.Test?.value}</div>;
};

interface ImportPropsType {
  Test?: Options;
}
export const ImportProps = {} as Partial<ImportPropsType>;
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type ImportPropsModel = Required<
  Omit<GetPropsType<typeof ImportProps>, 'Test'>
> &
  Partial<Pick<GetPropsType<typeof ImportProps>, 'Test'>>;
interface Import {
  props: ImportPropsModel & RestProps;
  restAttributes: RestProps;
}
export default function Import(inProps: typeof ImportProps & RestProps) {
  const props = combineWithDefaultProps<ImportPropsModel>(ImportProps, inProps);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { Test, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return viewFunction({
    props: { ...props },
    restAttributes: __restAttributes(),
  });
}
