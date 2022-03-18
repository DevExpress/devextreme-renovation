import { Options, AdditionalOptions } from './types.d';

export type WidgetPropsType = {
  height?: number;
  data?: Options;
  info?: AdditionalOptions;
};
const WidgetProps: WidgetPropsType = {
  height: 10,
  data: Object.freeze({ value: '' }) as any,
  info: Object.freeze({ index: 0 }) as any,
};
export default WidgetProps;
