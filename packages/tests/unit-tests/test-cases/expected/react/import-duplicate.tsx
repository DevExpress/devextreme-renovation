import { Options } from './types.d';
import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
export const viewFunction = (viewModel: Marker) => <div></div>;

export interface InterfaceConfig {
  value?: boolean;
}
export type TypeConfig = { value?: boolean };

interface MarkerPropsType {
  color?: Options;
  date?: Date;
  config?: InterfaceConfig | TypeConfig;
}
export const MarkerProps = {} as Partial<MarkerPropsType>;
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type MarkerPropsModel = Required<
  Omit<GetPropsType<typeof MarkerProps>, 'color' | 'date' | 'config'>
> &
  Partial<Pick<GetPropsType<typeof MarkerProps>, 'color' | 'date' | 'config'>>;
interface Marker {
  props: MarkerPropsModel & RestProps;
  restAttributes: RestProps;
}
export function Marker(inProps: typeof MarkerProps & RestProps) {
  const props = combineWithDefaultProps<MarkerPropsModel>(MarkerProps, inProps);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { color, config, date, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return viewFunction({
    props: { ...props },
    restAttributes: __restAttributes(),
  });
}

export default Marker;
