import type { Options } from './types.d';
export const viewFunction = (viewModel: Import) => {
  return <div>{viewModel.props.Test?.value}</div>;
};

export type ImportPropsType = {
  Test?: Options;
};
export const ImportProps: ImportPropsType = {};
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface Import {
  props: typeof ImportProps & RestProps;
  restAttributes: RestProps;
}

export default function Import(props: typeof ImportProps & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { Test, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return viewFunction({
    props: { ...props },
    restAttributes: __restAttributes(),
  });
}

Import.defaultProps = ImportProps;
