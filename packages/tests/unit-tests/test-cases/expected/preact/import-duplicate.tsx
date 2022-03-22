import { Options } from './types.d';
export const viewFunction = (viewModel: Marker) => <div></div>;

export interface InterfaceConfig {
  value?: boolean;
}
export type TypeConfig = { value?: boolean };

export type MarkerPropsType = {
  color?: Options;
  date?: Date;
  config?: InterfaceConfig | TypeConfig;
};
export const MarkerProps: MarkerPropsType = {};
import { useCallback } from 'preact/hooks';

type RestProps = {
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
      const { color, config, date, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return viewFunction({
    props: { ...props },
    restAttributes: __restAttributes(),
  });
}

Marker.defaultProps = MarkerProps;
