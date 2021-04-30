import { Options } from "./types.d";
export const viewFunction = (viewModel: Marker) => <div></div>;

export interface InterfaceConfig {
  value?: boolean;
}
export type TypeConfig = { value?: boolean };

export declare type MarkerPropsType = {
  color?: Options;
  date?: Date;
  config?: InterfaceConfig | TypeConfig;
};
export const MarkerProps: MarkerPropsType = {};
import * as React from "react";
import { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof MarkerProps
>;
interface Marker {
  props: typeof MarkerProps & RestProps;
  restAttributes: RestProps;
}

const Marker: React.FC<typeof MarkerProps & RestProps> = (props) => {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { color, config, date, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return viewFunction({
    props: { ...props },
    restAttributes: __restAttributes(),
  });
};

export default Marker;

export { Marker };

Marker.defaultProps = {
  ...MarkerProps,
};
