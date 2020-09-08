import { Options } from "./types.d";
import type { CustomClass } from "./types.d";
export const viewFunction = (viewModel: Import) => {
  return <div>{viewModel.props.Test?.value}</div>;
};

export declare type ImportPropsType = {
  Test?: Options;
};
export const ImportProps: ImportPropsType = {};
import React, { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof ImportProps
>;
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

Import.defaultProps = {
  ...ImportProps,
};
export * from "./types.d";
