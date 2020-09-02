import { Options } from "./types.d";
export const viewFunction = (viewModel: Marker) => <div></div>;

export declare type MarkerPropsType = {
  color?: Options;
};
export const MarkerProps: MarkerPropsType = {};
import * as Preact from "preact";
import { useCallback } from "preact/hooks";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
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

Marker.defaultProps = {
  ...MarkerProps,
};
export { Options };
