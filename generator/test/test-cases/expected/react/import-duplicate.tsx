import { Options } from "./types.d";
export const viewFunction = (viewModel: Marker) => <div></div>;

export declare type MarkerPropsType = {
  color?: Options;
};
export const MarkerProps: MarkerPropsType = {};
import React, { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof MarkerProps
>;
interface Marker {
  props: typeof MarkerProps & RestProps;
  restAttributes: RestProps;
}

export function Marker(props: typeof MarkerProps & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { color, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return viewFunction({
    props: { ...props },
    restAttributes: __restAttributes(),
  });
}

export default Marker;

Marker.defaultProps = {
  ...MarkerProps,
};
